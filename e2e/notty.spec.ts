import { expect, test } from "@playwright/test";

test.describe("notty", () => {
  test("has title / heading", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Notty/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notty");
  });
});
