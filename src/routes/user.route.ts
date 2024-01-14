import { UserController } from "../controllers";
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import refreshMiddleware from "../middlewares/refresh.middleware";

const router = Router();

router.post("/signUp", UserController.signUp);
router.post("/signIn", UserController.signIn);
router.post(
  "/signOut",
  refreshMiddleware,
  authMiddleware,
  UserController.signOut,
);
router.post("/refresh", refreshMiddleware, UserController.refreshToken);
router.get("/me", authMiddleware, UserController.me);

export default router;
