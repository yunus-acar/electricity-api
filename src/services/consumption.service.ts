import { ElectricityIndex } from "@prisma/client";
import prisma from "../utils/prisma";
import dayjs from "dayjs";
import { CreateConsumption } from "../interfaces/createConsumption.interface";

class ConsumptionService {
  create(data: CreateConsumption) {
    return prisma.consumption.create({
      data: {
        value: data.value,
        date: data.date,
        company: {
          connect: {
            id: data.companyId,
          },
        },
      },
    });
  }

  findMany(companyId: string) {
    return prisma.consumption.findMany({
      where: {
        companyId,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  findFirst(companyId: string, date: Date) {
    return prisma.consumption.findFirst({
      where: {
        companyId,
        date: date,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  update(id: string, consumption: number) {
    return prisma.consumption.update({
      where: {
        id,
      },
      data: {
        value: consumption,
      },
    });
  }

  async calculateConsumption(electricityIndexes: ElectricityIndex[]) {
    if (electricityIndexes.length <= 1) {
      return null;
    }

    await prisma.consumption.deleteMany({
      where: {
        companyId: electricityIndexes[0].companyId,
      },
    });

    const removedLastIndex = electricityIndexes.slice(0, -1);

    for (const electricityIndex of removedLastIndex) {
      const index = electricityIndexes.indexOf(electricityIndex);
      const nextIndex = electricityIndexes[index + 1];

      const startDate = dayjs(electricityIndex.date);
      const endDate = dayjs(nextIndex.date);

      const consumptionDiff = nextIndex.value - electricityIndex.value;

      const diffDayCount = dayjs(endDate).diff(startDate, "days");

      const diffConsumptionByDay = consumptionDiff / diffDayCount;

      for (let i = 0; i < diffDayCount; i++) {
        const date = startDate.add(i, "days").toISOString();

        await this.create({
          companyId: electricityIndex.companyId,
          date: new Date(date),
          value: diffConsumptionByDay,
        });
      }
    }

    return true;
  }
}

export default ConsumptionService;
