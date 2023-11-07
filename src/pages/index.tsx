import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>Notty</title>
        <meta name="description" content="A note taking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center pt-16">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-300 bg-clip-text text-transparent">
              Notty
            </span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-secondary-foreground">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <Button
        size="lg"
        variant="secondary"
        onClick={
          sessionData
            ? () => void signOut()
            : () =>
                void signIn("discord", {
                  callbackUrl: "/dashboard",
                })
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
