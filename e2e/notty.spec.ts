import { expect, test } from "@playwright/test";

test.describe("notty", () => {
  test("should have title / heading", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Notty/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notty");
  });

  test("should change theme", async ({ page }) => {
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

    test.describe("boards", () => {
      test("should have title / heading", async ({ page }) => {
        await expect(page).toHaveTitle("Dashboard");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          "Your dashboard",
        );
      });

      test("should create board", async ({ page }) => {
        await page.getByTestId("board-input").fill("testing");
        await page.getByTestId("create-board-btn").click();

        await expect(page.getByTestId("toast")).toHaveText(
          "Your board was created.",
        );
        await expect(page).toHaveTitle("testing");
      });

      test("should create board from my boards 'my boards' sheet", async ({
        page,
      }) => {
        const title = "test from sheet";
        await page.getByTestId("open-boards-btn").click();
        await page
          .getByLabel("My Boards")
          .getByTestId("board-input")
          .fill(title);
        await page
          .getByLabel("My Boards")
          .getByTestId("create-board-btn")
          .click();

        await expect(page.getByTestId("toast")).toHaveText(
          "Your board was created.",
        );
        await expect(page).toHaveTitle(title);
      });
    });

    test.describe("lists", () => {
      test("should create list on a board", async ({ page }) => {
        const title = "test list";
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();
        await page.getByTestId("show-add-list-btn").click();
        await page.getByTestId("list-input").fill(title);
        await page.getByTestId("create-list-btn").click();

        await expect(page.getByTestId("toast")).toHaveText(
          "Your list was created.",
        );
        await expect(page.getByTestId("list")).toHaveCount(2);
        await expect(page.getByTestId("list").last()).toContainText(title);
      });
    });

    test.describe("notes", () => {
      test("should create note on a list", async ({ page }) => {
        const title = "test note";
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();
        await page.getByTestId("show-add-note-btn").first().click();
        await page.getByTestId("note-input").fill(title);
        await page.getByTestId("create-note-btn").click();

        await expect(page.getByTestId("toast")).toHaveText(
          "Your note was created.",
        );
        await expect(
          page.getByTestId("list").first().getByTestId("note"),
        ).toHaveCount(2);
        await expect(
          page.getByTestId("list").first().getByTestId("note").last(),
        ).toContainText(title);
      });
    });
  });
});
