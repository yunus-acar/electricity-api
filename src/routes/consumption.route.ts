import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { ConsumptionController } from "../controllers";

const router = Router();

router.get("/all", authMiddleware, ConsumptionController.all);

export default router;
