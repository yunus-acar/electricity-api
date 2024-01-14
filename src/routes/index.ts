import { Router } from "express";
import UserRoute from "./user.route";
import ElectricityIndexRoute from "./electricityIndex.route";
import ConsumptionRoute from "./consumption.route";

const router = Router();

router.use("/user", UserRoute);
router.use("/electricityIndex", ElectricityIndexRoute);
router.use("/consumption", ConsumptionRoute);

export default router;
