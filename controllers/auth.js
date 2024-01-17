// npm modules
import jwt from 'jsonwebtoken'

// models
import { User } from "../models/user.js";
import { Profile } from "../models/profile.js";

const signup = async (req, res) => {
  try {
    if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')

    const user = await User.findOne({ email: req.body.email })
    if (user) throw new Error('Account already exists')

    req.body.isAdmin = req.body.email === process.env.EMAIL ? true : false
    const newProfile = await Profile.create(req.body)
    req.body.profile = newProfile._id
    const newUser = await User.create(req.body)

    const token = createJWT(newUser)
    res.status(200).json({ token })
  } catch (error) {
    console.log(error);
    try {
      if (req.body.profile) {
        await Profile.findByIdAndDelete(req.body.profile)
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message })
    }
    res.status(500).json({ error: error.message })
  }
}

const login = async (req, res) => {
  try {
    if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')

    const user = await User.findOne({ email: req.body.email })
    if (!user) throw new Error('User not found')

    const isMatch = await user.comparePassword(req.body.password)
    if (!isMatch) throw new Error('Incorrect Password')

    const token = createJWT(user)
    res.status(200).json({ token })
  } catch (error) {
    handleAuthError(error, res)
  }
}

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) throw new Error('User not found')

    const isMatch = user.comparePassword(req.body.password)
    if (!isMatch) throw new Error('Incorrect Password')

    user.password = req.body.newPassword
    await user.save()

    const token = createJWT(user)
    res.status(200).json({ token })
  } catch (error) {
    handleAuthError(error, res)
  }
}

// helper functions
function handleAuthError (error, res) {
  console.log(error);
  const { message } = error

  const errorMessages = [
    'User not found',
    'Incorrect Password',
    'Authorization denied',
  ]

  if (errorMessages.includes(message)) {
    res.status(401).json({ error: message })
  } else {
    res.status(500).json({ error: message })
  }
}

function createJWT(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' })
}

export {
  signup,
  login,
  changePassword,
  handleAuthError,
}