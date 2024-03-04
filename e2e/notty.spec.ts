import { expect, test } from "@playwright/test";

test.describe("notty", () => {
  test("has title / heading", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Notty/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notty");
  });

  test("changes theme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const theme = await html.getAttribute("class");

    await page.getByTestId("toggle-theme-btn").click();

    if (theme === "light") {
      await expect(html).toHaveClass("dark");
    } else {
      await expect(html).toHaveClass("light");
    }
  });

  test.describe("dashboard", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard");
    });

    test("has title / heading", async ({ page }) => {
      await expect(page).toHaveTitle("Dashboard");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Your dashboard",
      );
    });
  });
});
