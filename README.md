# notty

A simple Kanban board app to help you stay organized anywhere.

## ✨ Demo

[![notty Homepage](../media/notty-desktop.webp?raw=true)](https://notty-lucio.vercel.app)

## Getting Started

1. Install the dependencies:
   ```sh
   pnpm install
   ```
2. Create environment files:

   - `.env.development.local` used for `next dev`.
   - `.env` should mimic `.env.development.local` for the most part.
     - Prisma and Playwright prefer `.env` so it can be modified accordingly.
   - `.env.test.local` used for `vitest`. Check [SQLite Local Database](#sqlite-local-database) section for more info.
   - `.env.production.local` used for `next start`. Check [SQLite Database from Turso](#sqlite-database-from-turso-🫎) section for more info.

3. Add environment variables to environment files following `.env.example`.

   - For `DATASOURCE_URL` and `DATABASE_URL` see:
     - [SQLite Local Database](#sqlite-local-database) section.
     - [SQLite Database from Turso](#sqlite-database-from-turso-🫎) section.
   - For `DATABASE_AUTH_TOKEN` see:
     - [SQLite Database from Turso](#sqlite-database-from-turso-🫎) section.
   - For `UNSPLASH_ACCESS_KEY` see:
     - [Unsplash API](https://unsplash.com/documentation#getting-started)
   - For `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` see:
     - [NextAuth with the default DiscordProvider](#nextauth-with-the-default-discordprovider-🔒) section.
   - For `NEXT_AUTH_SECRET` see:
     - [Next Auth Secret](https://next-auth.js.org/configuration/options#secret)

4. Sync DB with prisma schema

   ```sh
   pnpm db:push
   ```

5. Run the application:
   ```sh
   pnpm dev
   ```

## Scripts 📜

### Install

```sh
pnpm install
```

### Build

Builds the app for production.

```sh
pnpm build
```

### Develop

Runs the app in development mode. Opens
[http://localhost:3000/](http://localhost:3000/) to view it in the browser.

```sh
pnpm dev
```

### Start

Locally preview the production build. Open
[http://localhost:3000/](http://localhost:3000/) to view it in the browser.

```sh
pnpm start
```

### Lint and Format

Runs eslint to fix linting errors.

```sh
pnpm lint
```

Format the application with prettier.

```sh
pnpm format
```

### Database

Sync the database with the prisma schema.

```sh
pnpm db:push
```

Opens Prisma studio on [http://localhost:5555](http://localhost:5555)

```sh
pnpm db:studio
```

### Test

Runs all test.

```sh
pnpm test
```

Runs unit/integration tests.

```sh
pnpm test:unit
```

Runs e2e tests.

```sh
pnpm test:e2e
```

## SQLite Local Database

For development and testing a local database can be use with a `*.sqlite` file.

### Development

Assign credentials to the environment variables inside `.env` and `.env.development.local`.

```sh
DATASOURCE_URL="file:./db.sqlite"
DATABASE_URL="file:./prisma/db.sqlite"
```

### Testing

Assign credentials to the environment variables inside `.env.test.local`.

```sh
DATASOURCE_URL="file:./test.sqlite"
DATABASE_URL="file:./prisma/test.sqlite"
```

`DATABASE_AUTH_TOKEN` is not needed for local development or testing.

## SQLite Database from [Turso](https://turso.tech/) 🫎

[Turso](https://turso.tech/) is a SQLite-compatible database built on [libSQL](https://github.com/tursodatabase/libsql/), the Open Contribution fork of SQLite.

### Connecting Turso

If you don't have an existing database, you can provision a database by running the following command:

```sh
turso db create <DATABASE_NAME>
```

1. Get the database URL:

   ```sh
   turso db show --url <DATABASE_NAME>
   ```

2. Get the database authentication token:

   ```sh
   turso db tokens create <DATABASE_NAME>
   ```

3. Assign credentials to the environment variables inside `.env.production.local`.

   ```sh
   DATASOURCE_URL="file:./dev.db"
   DATABASE_URL="<TURSO_DATABASE_URL>"
   DATABASE_AUTH_TOKEN="<TURSO_AUTH_TOKEN>"
   ```

4. Generate Prisma Client

   ```sh
   pnpm dlx prisma generate
   ```

5. Make an migration to sync with the Prisma schema.
   ```sh
   turso db shell <DATABASE_NAME> < <MIGRATION_FILE_PATH>
   ```
6. Make a production build:
   ```sh
   pnpm build
   ```
7. Run the production build, connected to Turso database:
   ```sh
   pnpm start
   ```

#### More on connecting Turso

- [How to connect and query a Turso Database](https://www.prisma.io/docs/orm/overview/databases/turso#how-to-connect-and-query-a-turso-database)
- [Prisma + Turso](https://docs.turso.tech/sdk/ts/orm/prisma)

### Migrations / Update database schema

Turso doesn't support Prisma Migrate. To update your database schema:

1.  Generate a migration file using prisma migrate dev against a local SQLite database:

    ```sh
    npx prisma migrate dev --name <NAME>
    ```

2.  Apply the migration using Turso's CLI:
    ```sh
    turso db shell <DATABASE_NAME> < ./prisma/migrations/<DATE_NAME>/migration.sql
    ```

For subsequent migrations, repeat the above steps to apply changes to your database.

#### More on Turso:

- [Manage Schema Changes](https://www.prisma.io/docs/orm/overview/databases/turso#how-to-manage-schema-changes)

## NextAuth with the default DiscordProvider 🔒

[Setting up the default DiscordProvider](https://create.t3.gg/en/usage/next-auth#setting-up-the-default-discordprovider)

1. Head to [the Applications section in the Discord Developer Portal](https://discord.com/developers/applications), and click on “New Application”.
2. In the settings menu, go to “OAuth2 => General”.

- Copy the Client ID and paste it in `DISCORD_CLIENT_ID` in `.env`.

- Under Client Secret, click “Reset Secret” and copy that string to `DISCORD_CLIENT_SECRET` in `.env`. Be careful as you won’t be able to see this secret again, and resetting it will cause the existing one to expire.
- Click “Add Redirect” and paste in `<app url>/api/auth/callback/discord`.
  (ex. for local development: `http://localhost:3000/api/auth/callback/discord`
  )
- Save your changes.
- It is possible, but not recommended, to use the same Discord Application for both development and production. You could also consider [Mocking the Provider](https://github.com/trpc/trpc/blob/main/examples/next-prisma-websockets-starter/src/pages/api/auth/%5B...nextauth%5D.ts) during development.

[More on NextAuth with T3](https://create.t3.gg/en/usage/next-auth)...  
[More on Discord OAuth2](https://discord.com/developers/docs/topics/oauth2)...

## Testing 🧪

### Unit/Integration tests 🧪

Unit/Integration testing uses [Vitest](https://vitest.dev/).  
Vitest aims for compatibility with [Jest](https://jestjs.io/).

This project uses [dotenv](https://github.com/motdotla/dotenv) to load the `.env.test.local` file in the `vitest.config.ts` file.

#### Setup testing

1.  Create `.env.test.local` file. Following `.env.example` template.
2.  Set `DATABASE_URL` to `"file:./prisma/test.sqlite"` in `.env.test.local`.
3.  Set `DATASOURCE_URL` to `file:./test.sqlite` in `pretest` script in `package.json`.
4.  Set `NODE_ENV` to `test` in `.env.test.local`.

#### Running Unit/Integration tests

1.  For the first time, use:

    ```sh
    pnpm test
    ```

    This will run the `pretest` script first and then `test` script.
    Or run directly:

    ```sh
    pnpm pretest
    pnpm vitest src
    ```

    The `pretest` script syncs the database with the Prisma schema.

    `Pretest` uses the `DATABASE_URL` explicitly since prisma cli would only read `.env` file. (https://github.com/prisma/prisma/issues/3865). Also the difference between `DATABASE_URL` in `.env.test.local` and `pretest` script comes from where they load the datasource `url`. `pretest` uses `schema.prisma` location but everything else use the `root`.

2.  Subsequently, tests can be run simply using:

    ```sh
    pnpm vitest src
    ```

    or use:

    ```sh
    pnpm test:unit
    ```

##### More Info

- [Driver Adapters](https://www.prisma.io/docs/orm/overview/databases/database-drivers#notes-about-using-driver-adapters)
- [Specify a SQLite data source](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#specify-a-sqlite-data-source)

#### Adding Unit/Integration tests

Add files for testing with `*.test.{ts|tsx}` pattern.

#### Updating DATABASE_URL

If you wish to change the name file for the test database, you need to change the `DATABASE_URL` value in:

- The `.env.test.local` file.
- The `pretest` script in the `package.json` file.

### E2E Tests 🧪

End-to-end testing is done using [Playwright](https://playwright.dev/).

#### Installing Playwright browsers

To install browsers run:

```sh
npx playwright install
```

#### Running e2e tests

To run only the e2e tests, use:

```sh
npx playwright test
```

or, use:

```sh
pnpm test:e2e
```

#### Adding e2e tests

Add files to `e2e` folder with `*.spec.{ts}` pattern.

#### Fix e2e tests

If the global setup needs to be reset:

1. Remove User from the DB.
   - Requires removing Account, Boards, Lists, and Notes.
   - Use `pn db:studio`to remove the User.
2. Run `npx playwright test` for global setup to be re-run.

### Run all tests

To run all tests use:

```sh
pnpm test
```

#### More on testing

- [Integration testing with Prisma](https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing)
- [Sample Integration Test with T3](https://create.t3.gg/en/usage/trpc#sample-integration-test)
- [Vitest](https://vitest.dev/)
- [Vitest test api](https://vitest.dev/api/)
- [Vitest CLI](https://vitest.dev/guide/cli.html)
- [Playwright Browsers](https://playwright.dev/docs/browsers)

## Deployment 🚀

### Deployed to [Vercel](https://vercel.com/)

1. Click **Add New Project**.
2. Import `github repo` to [Vercel](https://vercel.com/).
3. Set `FRAMEWORK PRESET` to Next.js.
4. Set `ROOT DIRECTORY` as `./`.
5. Add **environment variables**.
6. Click **Deploy**.

#### More on deployment

- [Vercel Deployment](https://create.t3.gg/en/deployment/vercel)
- [Netlify Deployment](https://create.t3.gg/en/deployment/netlify)
- [Railway Deployment with Docker](https://create.t3.gg/en/deployment/docker)

## More

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [T3 Documentation](https://create.t3.gg/)
- [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app)
