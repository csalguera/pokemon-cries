// models
import { User } from "../models/user.js";

// helper functions
import { handleAuthError } from "./auth.js";

const apply = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) throw new Error('User not found')
    if (user.isAdmin) throw new Error('User is already Admin')
    if (user.hasAdminApplication) throw new Error('Application pending')

    user.hasAdminApplication = true
    await user.save()

    const response = {
      message: 'Application successfully sent',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        hasAdminApplication: user.hasAdminApplication,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    handleAuthError(error, res)
  }
}

const index = async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true })
    res.status(200).json(admins)
  } catch (error) {
    handleAuthError(error, res)
  }
}

const filter = async (req, res) => {
  try {
    const users = await User.find({ hasAdminApplication: true })
    if (users.length) {
      res.status(200).json(users)
    } else {
      res.status(200).json({ msg: 'No applications found' })
    }
  } catch (error) {
    handleAuthError(error, res)
  }
}

const confirm = async (req, res) => {
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

const deny = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) throw new Error('User not found')
    if (user.isAdmin) throw new Error('Authorization denied')
    if (!user.hasAdminApplication) throw new Error('User did not apply for Admin')

    user.hasAdminApplication = false
    user.isAdmin = false
    await user.save()

    const response = {
      message: 'Admin privileges denied',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        hasAdminApplication: user.hasAdminApplication,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    handleAuthError(error, res)
  }
}

export {
  apply,
  index,
  filter,
  confirm,
  deny,
}