import { PrismaLibSql } from "@prisma/adapter-libsql";

import { env } from "@/env.mjs";

import { PrismaClient } from "../generated/prisma/client";

const libsql = {
  url: env.DATABASE_URL,
  authToken:
    env.NODE_ENV === "production" ? env.DATABASE_AUTH_TOKEN : undefined,
};

const adapter = new PrismaLibSql(libsql);

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter,
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
