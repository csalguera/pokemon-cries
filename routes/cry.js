// npm modules
import { Router } from "express";

// controllers
import * as cryCtrl from "../controllers/cry.js";

// middleware
import { uploadFile } from "../middleware/middleware.js";

const router = Router()

router.post('/', uploadFile, cryCtrl.create)
router.get('/', cryCtrl.index)
router.put('/:id', uploadFile, cryCtrl.update)
router.delete('/:id', cryCtrl.delete)
router.get('/:name', cryCtrl.show)
router.get('/generation/:gen', cryCtrl.filter)

export { router }