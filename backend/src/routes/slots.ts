import { Router } from "express";
import * as slotsController from "../controllers/slotsController";

const router = Router();

router.post('/', slotsController.createSlot);

router.get('/', slotsController.getSlotsForWeek);

router.put('/:id', slotsController.updateSlot);

router.delete('/:id', slotsController.deleteSlot);

export default router;