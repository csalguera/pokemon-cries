import { Router } from "express";
import { decodeUserFromToken, checkAuth } from "../middleware/auth";
import * as authCtrl from '../controllers/auth.js'

const router = Router()

// public routes
router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)

// private routes
router.use(decodeUserFromToken)
router.post('/change-password', checkAuth, authCtrl.changePassword)

export { router }