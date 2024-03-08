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
      const title = "test list";

      test("should create list on a board", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();
        await page.getByTestId("show-add-list-btn").click();
        await page.getByTestId("list-input").fill(title);
        await page.getByTestId("create-list-btn").click();

        await expect(page.getByTestId("toast")).toHaveText(
          "Your list was created.",
        );
        await expect(page.getByTestId("list")).toHaveCount(4);
        await expect(page.getByTestId("list").last()).toContainText(title);
      });

      test("should move last list to 1st place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging last list (test list) to 1st place
        await page.getByTestId("list").last().hover();
        await page.mouse.down();
        await page
          .getByTestId("list")
          .getByText(/1st LIST/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("list")
          .getByText(/1st LIST/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).toContainText(title);
        await expect(page.getByTestId("list").nth(1)).toContainText(/1st LIST/);
        await expect(page.getByTestId("list").nth(2)).toContainText(/2nd LIST/);
        await expect(page.getByTestId("list").last()).toContainText(/3rd LIST/);
      });

      test("should move 1st list to 3rd place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging first list (test list) to 3rd place
        await page.getByTestId("list").first().hover();
        await page.mouse.down();
        await page
          .getByTestId("list")
          .getByText(/2nd LIST/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("list")
          .getByText(/2nd LIST/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).toContainText(
          /1st LIST/,
        );
        await expect(page.getByTestId("list").nth(1)).toContainText(/2nd LIST/);
        await expect(page.getByTestId("list").nth(2)).toContainText(title);
        await expect(page.getByTestId("list").last()).toContainText(/3rd LIST/);
      });

      test("should move 3rd list to 2nd place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 3rd list (test list) to the 2nd place
        await page.getByTestId("list").nth(2).hover();
        await page.mouse.down();
        await page
          .getByTestId("list")
          .getByText(/2nd LIST/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("list")
          .getByText(/2nd LIST/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).toContainText(
          /1st LIST/,
        );
        await expect(page.getByTestId("list").nth(1)).toContainText(title);
        await expect(page.getByTestId("list").nth(2)).toContainText(/2nd LIST/);
        await expect(page.getByTestId("list").last()).toContainText(/3rd LIST/);
      });

      test("should move 2nd list to last place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 2nd list (test list) to the last place
        await page.getByTestId("list").nth(1).hover();
        await page.mouse.down();
        await page
          .getByTestId("list")
          .getByText(/3rd LIST/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("list")
          .getByText(/3rd LIST/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).toContainText(
          /1st LIST/,
        );
        await expect(page.getByTestId("list").nth(1)).toContainText(/2nd LIST/);
        await expect(page.getByTestId("list").nth(2)).toContainText(/3rd LIST/);
        await expect(page.getByTestId("list").last()).toContainText(title);
      });
    });

    test.describe("notes", () => {
      const title = "test note";

      test("should create note on a list", async ({ page }) => {
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
        ).toHaveCount(5);
        await expect(
          page.getByTestId("list").first().getByTestId("note").last(),
        ).toContainText(title);
      });

      test("should move last note to 1st place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging last note (test note) to 1st place
        await page.getByTestId("note").last().hover();
        await page.mouse.down();
        await page
          .getByTestId("note")
          .getByText(/1st NOTE/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("note")
          .getByText(/1st NOTE/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("note").first()).toContainText(title);
        await expect(page.getByTestId("note").nth(1)).toContainText(/1st NOTE/);
        await expect(page.getByTestId("note").nth(2)).toContainText(/2nd NOTE/);
        await expect(page.getByTestId("note").nth(3)).toContainText(/3rd NOTE/);
        await expect(page.getByTestId("note").last()).toContainText(/4th NOTE/);
      });

      test("should move 1st note to 3rd place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging first note (test note) to 3rd place
        await page.getByTestId("note").first().hover();
        await page.mouse.down();
        await page
          .getByTestId("note")
          .getByText(/2nd NOTE/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("note")
          .getByText(/2nd NOTE/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("note").first()).toContainText(
          /1st NOTE/,
        );
        await expect(page.getByTestId("note").nth(1)).toContainText(/2nd NOTE/);
        await expect(page.getByTestId("note").nth(2)).toContainText(title);
        await expect(page.getByTestId("note").nth(3)).toContainText(/3rd NOTE/);
        await expect(page.getByTestId("note").last()).toContainText(/4th NOTE/);
      });

      test("should move 3rd note to 2nd place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 3rd note (test note) to the 2nd place
        await page.getByTestId("note").nth(2).hover();
        await page.mouse.down();
        await page
          .getByTestId("note")
          .getByText(/2nd NOTE/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("note")
          .getByText(/2nd NOTE/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("note").first()).toContainText(
          /1st NOTE/,
        );
        await expect(page.getByTestId("note").nth(1)).toContainText(title);
        await expect(page.getByTestId("note").nth(2)).toContainText(/2nd NOTE/);
        await expect(page.getByTestId("note").nth(3)).toContainText(/3rd NOTE/);
        await expect(page.getByTestId("note").last()).toContainText(/4th NOTE/);
      });

      test("should move 2nd note to last place", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 2nd note (test note) to the last place
        await page.getByTestId("note").nth(1).hover();
        await page.mouse.down();
        await page
          .getByTestId("note")
          .getByText(/4th NOTE/)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("note")
          .getByText(/4th NOTE/)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("note").first()).toContainText(
          /1st NOTE/,
        );
        await expect(page.getByTestId("note").nth(1)).toContainText(/2nd NOTE/);
        await expect(page.getByTestId("note").nth(2)).toContainText(/3rd NOTE/);
        await expect(page.getByTestId("note").nth(3)).toContainText(/4th NOTE/);
        await expect(page.getByTestId("note").last()).toContainText(title);
      });

      test("should move last note to 2nd list", async ({ page }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 2nd note (test note) to the last place
        await page.getByTestId("note").last().hover();
        await page.mouse.down();
        await page.getByTestId("list").nth(1).hover(); // needs double .hover() since dnd implementation uses dragover event
        await page.getByTestId("list").nth(1).hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).not.toContainText(title);
        await expect(page.getByTestId("list").nth(1)).toContainText(title);
      });

      test("should move 1st note to 2nd list on 1st place", async ({
        page,
      }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 2nd note (test note) to the last place
        await page
          .getByTestId("list")
          .first()
          .getByTestId("note")
          .first()
          .hover();
        await page.mouse.down();
        await page
          .getByTestId("list")
          .nth(1)
          .getByTestId("note")
          .first()
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("list")
          .nth(1)
          .getByTestId("note")
          .first()
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).not.toContainText(
          /1st NOTE/,
        );
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").first(),
        ).toContainText(/1st NOTE/);
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").nth(1),
        ).toContainText(title);
      });

      test("should move 1st note to 2nd list on 2nd place", async ({
        page,
      }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 2nd note (test note) to the last place
        await page
          .getByTestId("list")
          .first()
          .getByTestId("note")
          .first()
          .hover();
        await page.mouse.down();
        await page
          .getByTestId("list")
          .nth(1)
          .getByTestId("note")
          .nth(1)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("list")
          .nth(1)
          .getByTestId("note")
          .nth(1)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).not.toContainText(
          /2nd NOTE/,
        );
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").first(),
        ).toContainText(/1st NOTE/);
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").nth(1),
        ).toContainText(/2nd NOTE/);
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").nth(2),
        ).toContainText(title);
      });

      test("should move 1st note to 2nd list on 3rd place", async ({
        page,
      }) => {
        await page.getByTestId("open-boards-btn").click();
        await page.getByTestId("board-link").first().click();

        // dragging 2nd note (test note) to the last place
        await page
          .getByTestId("list")
          .first()
          .getByTestId("note")
          .first()
          .hover();
        await page.mouse.down();
        await page
          .getByTestId("list")
          .nth(1)
          .getByTestId("note")
          .nth(2)
          .hover(); // needs double .hover() since dnd implementation uses dragover event
        await page
          .getByTestId("list")
          .nth(1)
          .getByTestId("note")
          .nth(2)
          .hover(); // https://playwright.dev/docs/input#drag-and-drop
        await page.mouse.up();

        await expect(page.getByTestId("list").first()).not.toContainText(
          /3rd NOTE/,
        );
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").first(),
        ).toContainText(/1st NOTE/);
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").nth(1),
        ).toContainText(/2nd NOTE/);
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").nth(2),
        ).toContainText(/3rd NOTE/);
        await expect(
          page.getByTestId("list").nth(1).getByTestId("note").nth(3),
        ).toContainText(title);
      });
    });
  });
});
