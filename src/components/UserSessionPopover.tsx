import { signIn, signOut, useSession } from "next-auth/react";

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
      <PopoverContent className="mt-3 w-80">
        <p>{sessionData?.user.name}</p>
        <Button variant="secondary" onClick={() => void signOut()}>
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default UserSessionPopover;
