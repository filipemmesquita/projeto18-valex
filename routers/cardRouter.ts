import { Router } from "express";
import { activateCard, blockCard, createCard, unblockCard } from "../controllers/cardController";
import { validateHeader } from "../middlewares/validateHeader";
import validateSchema from "../middlewares/validateSchema";
import newCardSchema from "../schemas/newCardSchema";
import activateSchema from "../schemas/activateCardSchema";
import blockSchema from "../schemas/blockAndUnblockCardSchema";

const router=Router();
router.post('/cards/new',validateHeader,validateSchema(newCardSchema),createCard)
router.put('/cards/activate',validateSchema(activateSchema),activateCard)
router.put('/cards/block',validateSchema(blockSchema),blockCard)
router.put('/cards/unblock',validateSchema(blockSchema),unblockCard)

export default router;