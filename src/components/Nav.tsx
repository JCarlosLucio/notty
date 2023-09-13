import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Nav = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="fixed z-20 h-16 w-full border-b bg-background/60 px-5 backdrop-blur-md md:px-32 2xl:px-60">
      <nav className="flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-extrabold"
        >
          Notty
        </Link>
        <div className="flex items-center">
          <div className="mr-5 flex h-7 items-center border-r pr-5">
            <ThemeToggle />
          </div>
          <div className="flex flex-row items-center gap-2">
            {sessionData && (
              <>
                <Avatar>
                  <AvatarImage src={sessionData?.user.image ?? undefined} />
                  <AvatarFallback>
                    {sessionData?.user.name?.at(0) ?? "N"}
                  </AvatarFallback>
                </Avatar>

                <p>{sessionData?.user?.name}</p>
              </>
            )}
            <Button
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
        </div>
      </nav>
    </header>
  );
};

export default Nav;
