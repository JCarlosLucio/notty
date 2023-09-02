# Create T3 App

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
