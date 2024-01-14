import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { CustomRequest } from "../interfaces/request.interface";
import ConsumptionService from "../services/consumption.service";

const consumptionService = new ConsumptionService();

class ConsumptionController {
  async all(req: CustomRequest, res: Response) {
    const userId = req.userId;

    try {
      const userExits = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          company: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!userExits) {
        return res.status(400).json({
          message: "User does not exists",
        });
      }

      const consumption = await consumptionService.findMany(
        userExits.company?.id as string,
      );

      console.log(consumption);

      return res.status(200).json(consumption);
    } catch (e: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: e.message,
      });
    }
  }
}

export default new ConsumptionController();
