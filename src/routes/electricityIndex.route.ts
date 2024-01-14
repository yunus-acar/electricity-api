import { ElectricityIndexController } from "../controllers";
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, ElectricityIndexController.create);
router.get("/all", authMiddleware, ElectricityIndexController.all);
router.delete("/delete/:id", authMiddleware, ElectricityIndexController.delete);

export default router;
