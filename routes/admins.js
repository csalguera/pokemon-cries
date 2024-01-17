// npm modules
import { Router } from "express";

// middleware
import { decodeUserFromToken, checkAuth, checkForAdmin } from "../middleware/auth.js";

// controllers
import * as adminsCtrl from '../controllers/admins.js'

const router = Router()

// private routes
router.use(decodeUserFromToken)
router.post('/apply', checkAuth, adminsCtrl.apply)
router.get('/applications', checkForAdmin, adminsCtrl.filter)
router.post('/confirm/:id', checkForAdmin, adminsCtrl.confirm)

export { router }