import { Router } from "express";
import { activateCard, createCard } from "../controllers/cardController";
import { validateHeader } from "../middlewares/validateHeader";
import validateSchema from "../middlewares/validateSchema";
import newCardSchema from "../schemas/newCardSchema";
import activateSchema from "../schemas/activateCardSchema";

const router=Router();
router.post('/cards/new',validateHeader,validateSchema(newCardSchema),createCard)
router.put('/card/activate',validateSchema(activateSchema),activateCard)

export default router;