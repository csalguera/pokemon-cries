// npm modules
import { Router } from "express";

// middleware
import { decodeUserFromToken, checkAuth, checkForAdmin } from "../middleware/auth.js";

// controllers
import * as authCtrl from '../controllers/auth.js'

const router = Router()

// public routes
router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)

// private routes
router.use(decodeUserFromToken)
router.post('/change-password', checkAuth, authCtrl.changePassword)
router.post('/apply', checkAuth, authCtrl.apply)
router.get('/applications', checkForAdmin, authCtrl.indexApplications)
router.post('/confirm-application/:id', checkForAdmin, authCtrl.confirmApplication)

export { router }