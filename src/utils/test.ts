import { env } from "@/env.mjs";
import { appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { db } from "@/server/db";

export const testUser = {
  id: "123",
  name: "Tester",
  email: "email@example.com",
};

// positions n,u,x,z
export const initialNotes = [
  {
    content: "1st NOTE seed",
    position: "n",
  },
  {
    content: "2nd NOTE seed",
    position: "u",
  },
  {
    content: "3rd NOTE seed",
    position: "x",
  },
  {
    content: "4th NOTE seed",
    position: "z",
  },
];
export const initialLists = [
  {
    title: "1st LIST seed",
    position: "n",
    notes: {
      create: initialNotes,
    },
  },
  {
    title: "2nd LIST seed",
    position: "u",
  },
  {
    title: "3rd LIST seed",
    position: "x",
  },
];
export const initialBoards = [
  {
    title: "1st BOARD seed",
    lists: {
      create: initialLists,
    },
  },
  {
    title: "2nd BOARD seed",
  },
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

  // Seed db
  // Add user with boards, lists, and notes.
  // https://www.prisma.io/docs/orm/prisma-client/queries/transactions#nested-writes
  // https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding#example-seed-scripts
  await db.user.upsert({
    where: {
      id: testUser.id,
    },
    update: {},
    create: {
      ...testUser,
      boards: {
        create: initialBoards,
      },
    },
  });
};

export const getBoardsInDB = async () => {
  if (env.NODE_ENV !== "test") throw Error("Can only get while testing");

  return await db.board.findMany();
};

export const getBoardInDB = async () => {
  const boards = await getBoardsInDB();
  const board = boards[0];

  if (!board) {
    throw new Error("Couldn't get board in test");
  }

  return board;
};

export const getListsInDB = async () => {
  const board = await getBoardInDB();

  return await db.list.findMany({ where: { boardId: board.id } });
};
