import { Response } from "express";
import prisma from "../utils/prisma";
import { CustomRequest } from "../interfaces/request.interface";
import dayjs from "dayjs";
import ElectricityIndexService from "../services/electricityIndex.service";
import ConsumptionService from "../services/consumption.service";

const electricityIndex = new ElectricityIndexService();
const consumption = new ConsumptionService();

class ElectricityIndexController {
  async create(req: CustomRequest, res: Response) {
    const { value, date } = req.body;
    const userId = req.userId;

    if (!value || !date) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (value <= 0) {
      return res.status(400).json({
        message: "Value must be greater than 0",
      });
    }
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

      const electricityIndexExists = await electricityIndex.findFirst({
        companyId: userExits.company?.id as string,
        date: new Date(dayjs(date).format("YYYY-MM-DD 00:00:00")),
      });

      if (electricityIndexExists) {
        return res.status(409).json({
          message: "Electricity index already exists",
        });
      }

      await electricityIndex.create({
        value,
        date: new Date(dayjs(date).format("YYYY-MM-DD 00:00:00")),
        company: {
          connect: {
            id: userExits.company?.id as string,
          },
        },
      });

      const indexes = await electricityIndex.findMany(
        {
          company: {
            id: userExits.company?.id as string,
          },
        },
        "asc",
      );

      await consumption.calculateConsumption(indexes);

      return res.status(201).json({
        message: "Electricity index created",
      });
    } catch (e: any) {
      console.log(e);
      return res.status(500).json({
        message: "Something went wrong",
        error: e.message,
      });
    }
  }

  async delete(req: CustomRequest, res: Response) {
    const userId = req.userId;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

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

      const electricityIndexExists = await prisma.electricityIndex.findUnique({
        where: {
          id,
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

      if (!electricityIndexExists) {
        return res.status(400).json({
          message: "Electricity index does not exists",
        });
      }

      if (electricityIndexExists.company.id !== userExits.company?.id) {
        return res.status(400).json({
          message: "Electricity index does not belongs to this user",
        });
      }

      await electricityIndex.delete(id);

      return res.status(200).json({
        message: "Electricity index deleted",
      });
    } catch (e: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: e.message,
      });
    }
  }

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

      const index = await electricityIndex.findMany({
        company: {
          id: userExits.company?.id as string,
        },
      });

      return res.status(200).json(index);
    } catch (e: any) {
      return res.status(500).json({
        message: "Something went wrong",
        error: e.message,
      });
    }
  }
}

export default new ElectricityIndexController();
