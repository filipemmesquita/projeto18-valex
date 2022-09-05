import { Router } from "express";
import { cardPayment, rechargeCard } from "../controllers/transactionController";
import validateSchema from "../middlewares/validateSchema";
import paymentSchema from "../schemas/paymentSchema";
import rechargeSchema from "../schemas/rechargeSchema";

const router=Router();
router.post('/transactions/recharge',validateSchema(rechargeSchema),rechargeCard)
router.post('/transactions/payment',validateSchema(paymentSchema),cardPayment)
export default router