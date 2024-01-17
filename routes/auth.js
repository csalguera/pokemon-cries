// npm modules
import { Router } from "express";

// middleware
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js";

// controllers
import * as authCtrl from '../controllers/auth.js'

const router = Router()

// public routes
router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)

// private routes
router.use(decodeUserFromToken)
router.post('/change-password', checkAuth, authCtrl.changePassword)

export { router }