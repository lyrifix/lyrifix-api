import { PrismaClient } from "../generated/prisma";

export const prismaClient = new PrismaClient({
  log: ["info", "error", "query"],
});
