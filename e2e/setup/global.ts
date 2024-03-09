import { type BrowserContext, chromium } from "@playwright/test";
import path from "path";

import { db } from "@/server/db";
// import { initialBoards } from "@/utils/test";

/**
 * https://playwright.dev/docs/auth
 * https://playwright.dev/docs/test-global-setup-teardown
 * https://github.com/juliusmarminge/t3-complete/blob/main/e2e/setup/global.ts
 */

type Cookie = Parameters<BrowserContext["addCookies"]>[0][0];
const testCookie: Cookie = {
  name: "next-auth.session-token",
  value: "d52f0c50-b8e3-4326-b48c-4d4a66fdeb64", // some random id
  domain: "localhost",
  path: "/",
  expires: -1, // expired => forces browser to refresh cookie on test run
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
};

const TEST_USER_ID = "testuserw000010zmbbkn65av";
const TEST_USER_EMAIL = "octocat@github.com";
const TEST_BOARD_ID = "firstboardseedaimfewrvhic";
export const TEST_BOARD_URL = `/b/${TEST_BOARD_ID}`;

export default async function globalSetup() {
  const now = new Date();

  await db.user.upsert({
    where: {
      email: TEST_USER_EMAIL,
    },
    create: {
      id: TEST_USER_ID,
      name: "Octocat",
      email: TEST_USER_EMAIL,
      image: "https://github.com/octocat.png",
      sessions: {
        create: {
          // create a session in db that hasn't expired yet, with the same id as the cookie
          expires: new Date(now.getFullYear(), now.getMonth() + 1, 0),
          sessionToken: testCookie.value,
        },
      },
      accounts: {
        // some random mocked discord account
        create: {
          type: "oauth",
          provider: "discord",
          providerAccountId: "123456789",
          access_token: "ggg_zZl1pWIvKkf3UDynZ09zLvuyZsm1yC0YoRPt",
          token_type: "bearer",
          scope: "email identify",
        },
      },
    },
    update: {},
  });

  const storageState = path.resolve(import.meta.dirname, "storage-state.json");
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState });
  await context.addCookies([testCookie]);
  await context.storageState({ path: storageState });
  await browser.close();
}

export async function cleanDB() {
  // Deletes test user boards, should cascade delete lists and notes
  // https://www.prisma.io/docs/orm/prisma-client/queries/crud#deleting-all-data-with-deletemany
  await db.board.deleteMany({
    where: {
      user: {
        email: TEST_USER_EMAIL,
      },
    },
  });

  // Seed db with test user boards, lists, notes
  await db.board.create({
    data: {
      title: "1st BOARD seed",
      userId: TEST_USER_ID,
      id: TEST_BOARD_ID,
      lists: {
        create: [
          {
            title: "1st LIST seed",
            position: "n",
            notes: {
              create: [
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
              ],
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
        ],
      },
    },
  });
}
