# Notty

A note taking app.

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Postgres Database from [Fly.io](https://fly.io/) 🚀

[Connect](https://fly.io/docs/flyctl/postgres-connect/) to your database instance to run queries (ex. \dt).

```sh
fly pg connect -a <postgres-app-name> -d <db-name>
```

The [local connection](https://fly.io/docs/postgres/connecting/connecting-with-flyctl/)
to the database should first be enabled by tunneling the localhost port `5432`.
The command must be left running while the database is used. So do not close the
console!

```sh
flyctl proxy 5432 -a <postgres-app-name>
```

To sync db with Prisma schema:

```sh
npx prisma db push
```

To watch in Prisma Studio:

```sh
npx prisma studio
```

Run migrations:

```sh
npx prisma migrate dev
```

## NextAuth with the default DiscordProvider

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

## Testing

Testing uses the [bun test runner](https://bun.sh/docs/cli/test). Bun aims for compatibility with [Jest](https://jestjs.io/), but not everything is implemented. To track compatibility, see [this tracking issue](https://github.com/oven-sh/bun/issues/1825)

### Setup testing.

1.  Create `.env.test.local` file. Following `.env.example` template.
2.  Set `DATABASE_URL` to `"file:./test.sqlite"`.

### Running tests.

1.  For the first time, use:

    ```sh
    bun run test
    ```

    This will run the `pretest` script first and then `test` script.
    Or run directly:

    ```sh
    bun pretest
    bun test
    ```

    The `pretest` script syncs the database with the Prisma schema.
    Uses the `DATABASE_URL` explicitly since prisma cli would only read `.env` file. (https://github.com/prisma/prisma/issues/3865)

2.  Subsequently, tests can be run simply using:
    ```sh
    bun test
    ```

### Adding tests

Add files for testing with `*.test.{ts|tsx}` pattern.

### Updating DATABASE_URL

If you wish to change the name file for the test database, you need to change the `DATABASE_URL` value in:

- The `.env.test.local` file.
- The `pretest` script in the `package.json` file.

## e2e Tests 🧪

End-to-end testing is done using [Playwright](https://playwright.dev/).

### Installing Playwright browsers

To install browsers run:

```sh
bunx playwright install
```

### Running e2e tests

To run only the e2e tests, use:

```sh
bunx playwright test
```

or, use:

```sh
bun test:e2e
```

### Adding e2e tests

Add files to `e2e` folder with `*.spec.{ts}` pattern.

## More on testing

- [Integration testing with Prisma](https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing)
- [Sample Integration Test with T3](https://create.t3.gg/en/usage/trpc#sample-integration-test)
- [bun test - Test runner](https://bun.sh/docs/cli/test)
- [Running tests with bun](https://bun.sh/docs/cli/test#run-tests)
- [Writing tests with bun](https://bun.sh/docs/test/writing)
- [Playwright Browsers](https://playwright.dev/docs/browsers)
