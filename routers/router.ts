import { Router } from "express";
import cardRouter from './cardRouter'
import transactionRouter from './transactionRouter'

const router=Router();
router.use(cardRouter)
router.use(transactionRouter)

export default router