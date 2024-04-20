import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: { session } };
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Notty</title>
        <meta name="description" content="A note taking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start pt-44">
        <div className="container flex flex-col items-center justify-center gap-24 pt-20">
          <div className="flex flex-col items-center gap-8">
            <h1 className="font-extrabold tracking-tight sm:text-[5rem]">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-300 bg-clip-text text-9xl text-transparent">
                Notty
              </span>
            </h1>
            <p className="bg-gradient-to-r from-emerald-500 to-teal-300 bg-clip-text text-lg text-transparent">
              A simple Kanban board app to help you stay organized anywhere.
            </p>
          </div>

          <AuthShowcase />
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h2 className="text-2xl">
        {sessionData
          ? `Signed in as ${sessionData.user?.name}`
          : "Sign in to your account"}
      </h2>

      {sessionData && (
        <Button asChild size="lg" variant="secondary">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      )}

      {sessionData ? (
        <Button size="lg" variant="destructive" onClick={() => void signOut()}>
          Sign out
        </Button>
      ) : (
        <Button
          size="lg"
          variant="secondary"
          className="bg-[#5865F2] text-white hover:bg-[#343c8d]"
          onClick={() =>
            void signIn("discord", {
              callbackUrl: "/dashboard",
            })
          }
        >
          <DiscordLogoIcon width={28} height={28} className="pr-2" /> Continue
          with Discord
        </Button>
      )}
    </div>
  );
}
