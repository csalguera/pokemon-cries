// npm modules
import { Router } from 'express'

// middleware
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

// controllers
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

// Private Routes
router.use(decodeUserFromToken)
router.get('/', checkAuth, profilesCtrl.index)

export { router }