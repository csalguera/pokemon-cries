import { Router } from "express";
import * as cryCtrl from "../controllers/cry.js";
import { uploadFile } from "../middleware/middleware.js";

const router = Router()

router.post('/', uploadFile, cryCtrl.create)
router.get('/', cryCtrl.index)
router.put('/:id', cryCtrl.update)
router.delete('/:id', cryCtrl.delete)

export { router }