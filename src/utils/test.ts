import { env } from "@/env.mjs";
import { appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { db } from "@/server/db";

export const testUser = {
  id: "123",
  name: "Tester",
  email: "email@example.com",
};

export const initialBoards = [
  { title: "first board" },
  { title: "second board" },
];

const testSession = {
  user: testUser,
  expires: "1",
};

const ctx = createInnerTRPCContext({ session: testSession });
export const caller = appRouter.createCaller(ctx);

const unauthorizedCtx = createInnerTRPCContext({ session: null });
export const unauthorizedCaller = appRouter.createCaller(unauthorizedCtx);

const notOwnerSession = {
  user: {
    id: "not_owner",
    name: "NotOwner",
    email: "notowner@example.com",
  },
  expires: "1",
};

const notOwnerCtx = createInnerTRPCContext({ session: notOwnerSession });
export const notOwnerCaller = appRouter.createCaller(notOwnerCtx);

export const resetDB = async () => {
  if (env.NODE_ENV !== "test") throw Error("Can only reset DB while testing");

  // Deletes users, boards, lists, and notes
  // https://www.prisma.io/docs/orm/prisma-client/queries/crud#deleting-all-data-with-deletemany
  const deleteBoards = db.board.deleteMany(); // should cascade delete lists and notes
  const deleteUsers = db.user.deleteMany();
  await db.$transaction([deleteBoards, deleteUsers]);

  // Add test user
  await db.user.create({
    data: testUser,
  });

  // Add initial boards (not using createMany because sqlite doesn't support it)
  // https://www.prisma.io/docs/orm/reference/prisma-client-reference#remarks-9
  // https://github.com/prisma/prisma/issues/10710#issuecomment-1198906656
  const boardsToInsert = initialBoards.map((board) =>
    db.board.create({ data: { ...board, userId: testUser.id } }),
  );
  await db.$transaction(boardsToInsert);
};

export const getBoardsInDB = async () => {
  return await db.board.findMany();
};
