import { Router } from "express";
import { activateCard, blockCard, createCard, unblockCard } from "../controllers/cardController";
import { validateHeader } from "../middlewares/validateHeader";
import validateSchema from "../middlewares/validateSchema";
import newCardSchema from "../schemas/newCardSchema";
import activateSchema from "../schemas/activateCardSchema";
import blockSchema from "../schemas/blockAndUnblockCardSchema";

const router=Router();
router.post('/cards/new',validateHeader,validateSchema(newCardSchema),createCard)
router.put('/card/activate',validateSchema(activateSchema),activateCard)
router.put('/card/block',validateSchema(blockSchema),blockCard)
router.put('/card/unblock',validateSchema(blockSchema),unblockCard)

export default router;