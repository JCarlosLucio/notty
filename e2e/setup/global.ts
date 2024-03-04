import { type BrowserContext, chromium } from "@playwright/test";
import path from "path";

import { db } from "@/server/db";

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

export default async function globalSetup() {
  const now = new Date();

  await db.user.upsert({
    where: {
      email: "octocat@github.com",
    },
    create: {
      name: "Octocat",
      email: "octocat@github.com",
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

  // Deletes test user boards, should cascade delete lists and notes
  // https://www.prisma.io/docs/orm/prisma-client/queries/crud#deleting-all-data-with-deletemany
  await db.board.deleteMany({
    where: {
      user: {
        email: "octocat@github.com",
      },
    },
  });

  const storageState = path.resolve(import.meta.dirname, "storage-state.json");
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState });
  await context.addCookies([testCookie]);
  await context.storageState({ path: storageState });
  await browser.close();
}
