import { Router } from "express";
import * as cryCtrl from "../controllers/cry.js";

const router = Router()

router.post('/', cryCtrl.create)
router.get('/', cryCtrl.index)
router.put('/:id', cryCtrl.update)
router.delete('/:id', cryCtrl.delete)

export { router }