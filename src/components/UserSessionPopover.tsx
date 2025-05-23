import { signIn, signOut, useSession } from "next-auth/react";

import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function UserSessionPopover() {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return (
      <Button
        variant="secondary"
        onClick={() =>
          void signIn("discord", {
            callbackUrl: "/dashboard",
          })
        }
      >
        Sign in
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="avatar">
          <Avatar>
            <AvatarImage src={sessionData?.user.image ?? undefined} />
            <AvatarFallback>
              {sessionData?.user.name?.at(0) ?? "N"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mt-3 flex w-72 flex-col gap-6 border">
        <div className="flex justify-between">
          <div>
            <p className="w-full truncate text-xl font-bold">
              {sessionData?.user.name}
            </p>
            <small>v.0.1.1</small>
          </div>
          <div className="ml-2 flex h-7 items-center pl-2">
            <ThemeToggle />
          </div>
        </div>
        <Button variant="destructive" onClick={() => void signOut()}>
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default UserSessionPopover;
