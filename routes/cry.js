import { Router } from "express";
import * as cryCtrl from "../controllers/cry.js";
import { upload } from "../middleware/middleware.js";

const router = Router()

router.post('/', upload, cryCtrl.create)
router.get('/', cryCtrl.index)
router.put('/:id', cryCtrl.update)
router.delete('/:id', cryCtrl.delete)

export { router }