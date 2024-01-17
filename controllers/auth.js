import jwt from 'jsonwebtoken'

import { User } from "../models/user.js";
import { Profile } from "../models/profile.js";

const signup = async (req, res) => {
  try {
    if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')

    const user = await User.findOne({ email: req.body.email })
    if (user) throw new Error('Account already exists')

    const newProfile = await Profile.create(req.body)
    req.body.profile = newProfile._id
    req.body.isAdmin = req.body.email === process.env.EMAIL ? true : false
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

const apply = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) throw new Error('User not found')
    if (user.isAdmin) throw new Error('User is already Admin')

    user.hasAdminApplication = true
    await user.save()

    const token = createJWT(user)
    res.status(200).json({ token })
  } catch (error) {
    handleAuthError(error, res)
  }
}

const indexApplications = async (req, res) => {
  try {
    const users = await User.find({ hasAdminApplication: true })
    res.status(200).json(users)
  } catch (error) {
    handleAuthError(error, res)
  }
}

const confirmApplication = async (req, res) => {
  try {
    const newAdmin = await User.findById(req.params.id)
    if (!newAdmin) throw new Error('User not found')
    if (newAdmin.isAdmin) throw new Error('User is already Admin')
    if (!newAdmin.hasAdminApplication) throw new Error('User did not apply for Admin')
  
    newAdmin.hasAdminApplication = false
    newAdmin.isAdmin = true
    await newAdmin.save()

    const response = {
      message: 'Admin privileges granted successfully',
      user: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        isAdmin: newAdmin.isAdmin,
        hasAdminApplication: newAdmin.hasAdminApplication,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    handleAuthError(error, res)
  }
}

function handleAuthError (error, res) {
  console.log(error);
  const { message } = error

  const errorMessages = [
    'User not found',
    'Incorrect Password',
    'User is already Admin',
    'User is not an Admin',
    'User did not apply for Admin',
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
  apply,
  indexApplications,
  confirmApplication,
}