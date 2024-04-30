import { expect, test } from "@playwright/test";

import { cleanDB, TEST_BOARD_URL } from "./setup/global";

test.describe("Home", () => {
  test("should have title / heading", async ({ page }) => {
    await page.goto("/");

    // redirected to /dashboard if signed in
    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your dashboard",
    );
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
});

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("should have title / heading", async ({ page }) => {
    await expect(page).toHaveTitle("Dashboard");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your dashboard",
    );
  });

  test("should create board from Dashboard", async ({ page }) => {
    const title = "testing";

    await page.getByTestId("board-input").fill(title);
    await page.getByTestId("create-board-btn").click();

    await expect(page.getByTestId("toast")).toHaveText(
      "Your board was created.",
    );
    await expect(page).toHaveTitle(title);
  });

  test("should create board from my boards 'my boards' sheet", async ({
    page,
  }) => {
    const title = "test from sheet";

    await page.getByTestId("open-boards-btn").click();
    await page.getByLabel("My Boards").getByTestId("board-input").fill(title);
    await page.getByLabel("My Boards").getByTestId("create-board-btn").click();

    await expect(page.getByTestId("toast")).toHaveText(
      "Your board was created.",
    );
    await expect(page).toHaveTitle(title);
  });
});

test.describe("Boards", () => {
  test.beforeEach(async ({ page }) => {
    await cleanDB();
    await page.goto(TEST_BOARD_URL);
  });

  test("should update board title", async ({ page }) => {
    const updatedTitle = "Updated title";

    await page.getByTestId("open-board-details-btn").click();
    await page.getByTestId("show-update-board-btn").click();
    await page.getByPlaceholder("Your new board title...").fill(updatedTitle);
    await page.getByTestId("save-board-btn").click();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page).toHaveTitle(updatedTitle);
  });

  test("should update board bg to a color", async ({ page }) => {
    await page.getByTestId("open-board-details-btn").click();
    await page.getByTestId("show-update-board-btn").click();

    const colorBtn = page.getByTestId("select-color-btn").first();
    const colorBg = await colorBtn.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue("background"),
    );

    await colorBtn.click();

    const bgProp = "background";
    await expect(page.getByTestId("bg-preview")).toHaveCSS(bgProp, colorBg);

    await page.getByTestId("save-board-btn").click();
    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.getByTestId("current-board")).toHaveCSS(bgProp, colorBg);
  });

  test("should update board bg to a photo", async ({ page }) => {
    await page.getByTestId("open-board-details-btn").click();
    await page.getByTestId("show-update-board-btn").click();
    await page.getByTestId("photos-tab").click();

    await page.getByTestId("select-photo-btn").first().click();

    const bgProp = "background";
    await expect(page.getByTestId("bg-preview")).toHaveCSS(bgProp, /url/);
    await expect(page.getByTestId("bg-preview")).toHaveCSS(
      bgProp,
      /images.unsplash.com/,
    );
    await expect(page.getByTestId("bg-preview")).not.toHaveCSS(bgProp, /none/);

    await page.getByTestId("save-board-btn").click();
    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.getByTestId("current-board")).toHaveCSS(bgProp, /url/);
    await expect(page.getByTestId("current-board")).toHaveCSS(
      bgProp,
      /images.unsplash.com/,
    );
    await expect(page.getByTestId("current-board")).not.toHaveCSS(
      bgProp,
      /none/,
    );
  });

  test("should update board bg with a searched photo", async ({ page }) => {
    await page.getByTestId("open-board-details-btn").click();
    await page.getByTestId("show-update-board-btn").click();
    await page.getByTestId("photos-tab").click();

    const initialPhotoBg = await page
      .getByTestId("select-photo-btn")
      .first()
      .evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue("background"),
      );

    // fill search input
    await page.getByTestId("search-photos-input").fill("landscape");
    // wait for debounced query
    await page.waitForTimeout(2500);

    const bgProp = "background";

    // check photos changed after query
    await expect(page.getByTestId("select-photo-btn").first()).not.toHaveCSS(
      bgProp,
      initialPhotoBg,
    );

    await page.getByTestId("select-photo-btn").first().click();

    await expect(page.getByTestId("bg-preview")).toHaveCSS(bgProp, /url/);
    await expect(page.getByTestId("bg-preview")).toHaveCSS(
      bgProp,
      /images.unsplash.com/,
    );
    await expect(page.getByTestId("bg-preview")).not.toHaveCSS(bgProp, /none/);

    await page.getByTestId("save-board-btn").click();
    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.getByTestId("current-board")).toHaveCSS(bgProp, /url/);
    await expect(page.getByTestId("current-board")).toHaveCSS(
      bgProp,
      /images.unsplash.com/,
    );
    await expect(page.getByTestId("current-board")).not.toHaveCSS(
      bgProp,
      /none/,
    );
  });
});

test.describe("Lists", () => {
  test.beforeEach(async ({ page }) => {
    await cleanDB();
    await page.goto(TEST_BOARD_URL);
  });

  test("should create list on a board", async ({ page }) => {
    const title = "test list";

    await page.getByTestId("show-add-list-btn").click();
    await page.getByTestId("list-input").fill(title);
    await page.getByTestId("create-list-btn").click();

    await expect(page.getByTestId("toast")).toHaveText(
      "Your list was created.",
    );
    await expect(page.getByTestId("list")).toHaveCount(4);
    await expect(page.getByTestId("list").last()).toContainText(title);
  });

  test("should update list title", async ({ page }) => {
    const updatedTitle = "Updated title";

    await page.getByTestId("open-list-details-btn").last().click();
    await page.getByTestId("show-update-list-btn").click();
    await page.getByPlaceholder("Your new list title...").fill(updatedTitle);
    await page.getByTestId("save-list-btn").click();
    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.getByTestId("list").last()).toContainText(updatedTitle);
  });

  /** Drag n' Drop tests need double .hover() since dnd implementation uses dragover event.
   *  More info: https://playwright.dev/docs/input#drag-and-drop
   */

  test("should move last list to 1st place", async ({ page }) => {
    // dragging last list (3rd LIST) to 1st place
    await page.getByTestId("list").last().hover();
    await page.mouse.down();
    await page
      .getByTestId("list")
      .getByText(/1st LIST/)
      .hover();
    await page
      .getByTestId("list")
      .getByText(/1st LIST/)
      .hover();
    await page.mouse.up();

    await expect(page.getByTestId("list").first()).toContainText(/3rd LIST/);
    await expect(page.getByTestId("list").nth(1)).toContainText(/1st LIST/);
    await expect(page.getByTestId("list").nth(2)).toContainText(/2nd LIST/);
  });

  test("should move 1st list to 2nd place", async ({ page }) => {
    // dragging 1st list (1st LIST) to 2nd place
    await page.getByTestId("list").first().hover();
    await page.mouse.down();
    await page
      .getByTestId("list")
      .getByText(/2nd LIST/)
      .hover();
    await page
      .getByTestId("list")
      .getByText(/2nd LIST/)
      .hover();
    await page.mouse.up();

    await expect(page.getByTestId("list").first()).toContainText(/2nd LIST/);
    await expect(page.getByTestId("list").nth(1)).toContainText(/1st LIST/);
    await expect(page.getByTestId("list").last()).toContainText(/3rd LIST/);
  });

  test("should move 2nd list to 1st place", async ({ page }) => {
    // dragging 2nd list (2nd LIST) to 2nd place
    await page.getByTestId("list").nth(1).hover();
    await page.mouse.down();
    await page
      .getByTestId("list")
      .getByText(/1st LIST/)
      .hover();
    await page
      .getByTestId("list")
      .getByText(/1st LIST/)
      .hover();
    await page.mouse.up();

    await expect(page.getByTestId("list").first()).toContainText(/2nd LIST/);
    await expect(page.getByTestId("list").nth(1)).toContainText(/1st LIST/);
    await expect(page.getByTestId("list").last()).toContainText(/3rd LIST/);
  });

  test("should move 2nd list to last place", async ({ page }) => {
    // dragging 2nd list (2nd LIST) to last place
    await page.getByTestId("list").nth(1).hover();
    await page.mouse.down();
    await page
      .getByTestId("list")
      .getByText(/3rd LIST/)
      .hover();
    await page
      .getByTestId("list")
      .getByText(/3rd LIST/)
      .hover();
    await page.mouse.up();

    await expect(page.getByTestId("list").first()).toContainText(/1st LIST/);
    await expect(page.getByTestId("list").nth(1)).toContainText(/3rd LIST/);
    await expect(page.getByTestId("list").last()).toContainText(/2nd LIST/);
  });
});

test.describe("Notes", () => {
  test.beforeEach(async ({ page }) => {
    await cleanDB();
    await page.goto(TEST_BOARD_URL);
  });

  test("should create note on a list", async ({ page }) => {
    const title = "test note";

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

  test("should update note title", async ({ page }) => {
    const updatedTitle = "Updated note title";

    await page.getByTestId("note").last().hover();
    await page.getByTestId("open-note-details-btn").last().click();
    await page.getByTestId("show-update-note-btn").click();
    await page.getByPlaceholder("Your new note title...").fill(updatedTitle);
    await page.getByTestId("save-note-btn").click();
    await page.getByRole("button", { name: "Close" }).click();

    await expect(page.getByTestId("note").last()).toContainText(updatedTitle);
  });

  /** Again Drag n' Drop tests need double .hover() */

  test.describe("Move notes within a list", () => {
    test("should move last note to 1st place", async ({ page }) => {
      // dragging last note (4th NOTE) to 1st place
      await page.getByTestId("note").last().hover();
      await page.mouse.down();
      await page
        .getByTestId("note")
        .getByText(/1st NOTE/)
        .hover();
      await page
        .getByTestId("note")
        .getByText(/1st NOTE/)
        .hover();
      await page.mouse.up();

      await expect(page.getByTestId("note").first()).toContainText(/4th NOTE/);
      await expect(page.getByTestId("note").nth(1)).toContainText(/1st NOTE/);
      await expect(page.getByTestId("note").nth(2)).toContainText(/2nd NOTE/);
      await expect(page.getByTestId("note").nth(3)).toContainText(/3rd NOTE/);
    });

    test("should move 1st note to 3rd place", async ({ page }) => {
      // dragging first note (1st NOTE) to 3rd place
      await page.getByTestId("note").first().hover();
      await page.mouse.down();
      await page
        .getByTestId("note")
        .getByText(/3rd NOTE/)
        .hover();
      await page
        .getByTestId("note")
        .getByText(/3rd NOTE/)
        .hover();
      await page.mouse.up();

      await expect(page.getByTestId("note").first()).toContainText(/2nd NOTE/);
      await expect(page.getByTestId("note").nth(1)).toContainText(/3rd NOTE/);
      await expect(page.getByTestId("note").nth(2)).toContainText(/1st NOTE/);
      await expect(page.getByTestId("note").nth(3)).toContainText(/4th NOTE/);
    });

    test("should move 3rd note to 2nd place", async ({ page }) => {
      // dragging 3rd note (3rd NOTE) to 2nd place
      await page.getByTestId("note").nth(2).hover();
      await page.mouse.down();
      await page
        .getByTestId("note")
        .getByText(/2nd NOTE/)
        .hover();
      await page
        .getByTestId("note")
        .getByText(/2nd NOTE/)
        .hover();
      await page.mouse.up();

      await expect(page.getByTestId("note").first()).toContainText(/1st NOTE/);
      await expect(page.getByTestId("note").nth(1)).toContainText(/3rd NOTE/);
      await expect(page.getByTestId("note").nth(2)).toContainText(/2nd NOTE/);
      await expect(page.getByTestId("note").nth(3)).toContainText(/4th NOTE/);
    });

    test("should move 2nd note to last place", async ({ page }) => {
      // dragging 2nd note (2nd NOTE) to last place
      await page.getByTestId("note").nth(1).hover();
      await page.mouse.down();
      await page
        .getByTestId("note")
        .getByText(/4th NOTE/)
        .hover();
      await page
        .getByTestId("note")
        .getByText(/4th NOTE/)
        .hover();
      await page.mouse.up();

      await expect(page.getByTestId("note").first()).toContainText(/1st NOTE/);
      await expect(page.getByTestId("note").nth(1)).toContainText(/3rd NOTE/);
      await expect(page.getByTestId("note").nth(2)).toContainText(/4th NOTE/);
      await expect(page.getByTestId("note").nth(3)).toContainText(/2nd NOTE/);
    });
  });

  test.describe("Move notes between lists", () => {
    test("should move last note to 2nd list", async ({ page }) => {
      // dragging last note (4th NOTE) to the 2nd list
      await page.getByTestId("note").last().hover();
      await page.mouse.down();
      await page.getByTestId("list").nth(1).hover();
      await page.getByTestId("list").nth(1).hover();
      await page.mouse.up();

      await expect(page.getByTestId("list").first()).not.toContainText(
        /4th NOTE/,
      );
      await expect(page.getByTestId("list").nth(1)).toContainText(/4th NOTE/);
    });

    test("should move 3rd note to 2nd list and back to 1st place", async ({
      page,
    }) => {
      // dragging 3rd note (3rd NOTE) to 2nd list and back to 1st place on 1st list
      await page
        .getByTestId("note")
        .getByText(/3rd NOTE/)
        .hover();
      await page.mouse.down();
      await page.getByTestId("list").nth(1).hover();
      await page.getByTestId("list").nth(1).hover();
      await page.mouse.up();

      await expect(page.getByTestId("list").first()).not.toContainText(
        /3rd NOTE/,
      );
      await expect(
        page.getByTestId("list").nth(1).getByTestId("note").first(),
      ).toContainText(/3rd NOTE/);

      // return note to first list on 1st place
      await page.getByTestId("list").nth(1).getByTestId("note").first().hover();
      await page.mouse.down();
      await page
        .getByTestId("note")
        .getByText(/1st NOTE/)
        .hover();
      await page
        .getByTestId("note")
        .getByText(/1st NOTE/)
        .hover();
      await page.mouse.up();

      await expect(page.getByTestId("list").nth(1)).not.toContainText(
        /3rd NOTE/,
      );
      await expect(
        page.getByTestId("list").first().getByTestId("note").first(),
      ).toContainText(/3rd NOTE/);
      await expect(
        page.getByTestId("list").first().getByTestId("note").nth(1),
      ).toContainText(/1st NOTE/);
    });

    test("should move last note to 2nd list and back to 2nd place", async ({
      page,
    }) => {
      // dragging last note (4th NOTE) to 2nd list on 2nd place
      await page
        .getByTestId("note")
        .getByText(/4th NOTE/)
        .hover();
      await page.mouse.down();
      await page.getByTestId("list").nth(1).hover();
      await page.getByTestId("list").nth(1).hover();
      await page.mouse.up();

      await expect(page.getByTestId("list").first()).not.toContainText(
        /4th NOTE/,
      );
      await expect(
        page.getByTestId("list").nth(1).getByTestId("note").first(),
      ).toContainText(/4th NOTE/);

      // return note to first list on 2nd place
      await page.getByTestId("list").nth(1).getByTestId("note").first().hover();
      await page.mouse.down();
      await page
        .getByTestId("note")
        .getByText(/2nd NOTE/)
        .hover();
      await page
        .getByTestId("note")
        .getByText(/2nd NOTE/)
        .hover();
      await page.mouse.up();

      await expect(page.getByTestId("list").nth(1)).not.toContainText(
        /4th NOTE/,
      );
      await expect(
        page.getByTestId("list").first().getByTestId("note").nth(1),
      ).toContainText(/4th NOTE/);
      await expect(
        page.getByTestId("list").first().getByTestId("note").nth(2),
      ).toContainText(/2nd NOTE/);
    });

    test("should move 1st note to 3rd list and back to 3rd place", async ({
      page,
    }) => {
      // dragging 1st note (1st NOTE) to 3rd list on 3rd place
      await page
        .getByTestId("note")
        .getByText(/1st NOTE/)
        .hover();
      await page.mouse.down();
      await page.getByTestId("list").nth(2).hover();
      await page.getByTestId("list").nth(2).hover();
      await page.mouse.up();

      await expect(page.getByTestId("list").first()).not.toContainText(
        /1st NOTE/,
      );
      await expect(
        page.getByTestId("list").nth(2).getByTestId("note").first(),
      ).toContainText(/1st NOTE/);

      // return note to first list on 3rd place
      await page.getByTestId("list").nth(2).getByTestId("note").first().hover();
      await page.mouse.down();
      await page
        .getByTestId("note")
        .getByText(/4th NOTE/)
        .hover();
      await page
        .getByTestId("note")
        .getByText(/4th NOTE/)
        .hover();
      await page.mouse.up();

      await expect(page.getByTestId("list").nth(2)).not.toContainText(
        /1st NOTE/,
      );
      await expect(
        page.getByTestId("list").first().getByTestId("note").nth(2),
      ).toContainText(/1st NOTE/);
      await expect(
        page.getByTestId("list").first().getByTestId("note").last(),
      ).toContainText(/4th NOTE/);
    });
  });
});
