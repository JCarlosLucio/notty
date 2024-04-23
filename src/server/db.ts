import { PrismaClient } from "@prisma/client";

import { env } from "@/env.mjs";

import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const libsql = createClient({
  url: env.DATABASE_URL,
  authToken:
    env.NODE_ENV === "production" ? env.DATABASE_AUTH_TOKEN : undefined,
});

const adapter = new PrismaLibSQL(libsql);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter,
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
