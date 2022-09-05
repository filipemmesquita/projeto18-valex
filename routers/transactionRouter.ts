import { Router } from "express";
import { rechargeCard } from "../controllers/transactionController";
import validateSchema from "../middlewares/validateSchema";
import rechargeSchema from "../schemas/rechargeSchema";

const router=Router();
router.post('/transactions/recharge',validateSchema(rechargeSchema),rechargeCard)

export default router