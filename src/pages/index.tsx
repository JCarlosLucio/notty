import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Header from "@/config";
import { getServerAuthSession } from "@/server/auth";
import GradientBlobs from "@/components/GradientBlobs";

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
      <Header title="notty" />

      <main className="relative flex min-h-screen flex-col items-center justify-start pt-44">
        <GradientBlobs />
        <div className="container flex flex-col items-center justify-center gap-24 pt-20">
          <div className="flex flex-col items-center gap-8">
            <h1 className="font-extrabold tracking-tight sm:text-[5rem]">
              <span className="bg-gradient-to-r from-emerald-950 to-teal-800 bg-clip-text text-9xl text-transparent dark:from-emerald-200 dark:to-teal-100">
                notty
              </span>
            </h1>
            <p className="bg-gradient-to-r from-emerald-950 to-teal-800 bg-clip-text text-lg text-transparent dark:from-emerald-200 dark:to-teal-100">
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
