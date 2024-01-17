// npm modules
import { Router } from "express";

// controllers
import * as cryCtrl from "../controllers/cries.js";

// middleware
import { uploadFile } from "../middleware/middleware.js";
import { decodeUserFromToken, checkForAdmin } from "../middleware/auth.js";

const router = Router()

// public routes
router.get('/', cryCtrl.index)
router.get('/:name', cryCtrl.show)

// private routes
router.use(decodeUserFromToken)
router.post('/', checkForAdmin, uploadFile, cryCtrl.create)
router.put('/:id', checkForAdmin, uploadFile, cryCtrl.update)
router.delete('/:id', checkForAdmin, cryCtrl.delete)
router.get('/generation/:gen',checkForAdmin, cryCtrl.filter)

export { router }