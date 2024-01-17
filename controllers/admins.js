// models
import { User } from "../models/user.js";
import { Profile } from "../models/profile.js";

// helper functions
import { handleAuthError } from "./auth.js";

const apply = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) throw new Error('User not found')
    if (user.isAdmin) throw new Error('Authorization denied')
    if (user.hasAdminApplication) throw new Error('Authorization denied')

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
    const profile = await Profile.findById({ _id: newAdmin.profile._id })
    if (!newAdmin) throw new Error('User not found')
    if (newAdmin.isAdmin) throw new Error('Authorization denied')
    if (!newAdmin.hasAdminApplication) throw new Error('Authorization denied')
  
    newAdmin.hasAdminApplication = false
    newAdmin.isAdmin = true
    await newAdmin.save()
    profile.isAdmin = true
    await profile.save()

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
    if (!user.hasAdminApplication) throw new Error('Authorization denied')

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

const demote = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id)
    const profile = await Profile.findById({ _id: admin.profile._id })
    if (!admin) throw new Error('User not found')
    if (!admin.isAdmin) throw new Error('Authorization denied')
    if (admin.email === process.env.EMAIL) throw new Error('Authorization denied')

    admin.isAdmin = false
    await admin.save()
    profile.isAdmin=false
    await profile.save()

    const response = {
      message: 'Admin privileges removed',
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
        hasAdminApplication: admin.hasAdminApplication,
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
  demote,
}