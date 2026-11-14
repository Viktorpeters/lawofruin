import { PrismaClient } from "@prisma/client";

/* One database client for the whole server. */
export const prisma = new PrismaClient();
