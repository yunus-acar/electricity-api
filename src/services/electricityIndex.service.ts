import prisma, { Prisma } from "../utils/prisma";
import { ElectricityIndex } from "@prisma/client";

interface CreateElectricityIndex {
  value: number;
  date: Date;
  companyId: string;
}

class ElectricityIndexService {
  async create(data: Prisma.ElectricityIndexCreateInput) {
    return prisma.electricityIndex.create({
      data,
    });
  }

  async findFirst(
    where: Prisma.ElectricityIndexWhereInput,
    skip?: number,
    take?: number,
  ) {
    return prisma.electricityIndex.findFirst({
      where,
      orderBy: {
        date: "desc",
      },
      skip,
      take,
    });
  }

  async findMany(
    where: Prisma.ElectricityIndexWhereInput,
    sortOrder: "asc" | "desc" = "desc",
  ) {
    return prisma.electricityIndex.findMany({
      where,
      orderBy: {
        date: sortOrder,
      },
    });
  }

  delete(id: string) {
    return prisma.electricityIndex.delete({
      where: {
        id,
      },
    });
  }
}

export default ElectricityIndexService;
