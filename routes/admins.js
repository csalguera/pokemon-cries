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
router.get('/', checkForAdmin, adminsCtrl.index)
router.get('/applications', checkForAdmin, adminsCtrl.filter)
router.post('/confirm/:id', checkForAdmin, adminsCtrl.confirm)
router.post('/deny/:id', checkForAdmin, adminsCtrl.deny)
router.post('/demote/:id', checkForAdmin, adminsCtrl.demote)

export { router }