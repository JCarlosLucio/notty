import { type GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
};

const Dashboard = () => {
  const { data: sessionData } = useSession();

  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarImage src={sessionData?.user.image ?? undefined} />
          <AvatarFallback>
            {sessionData?.user.name?.at(0) ?? "N"}
          </AvatarFallback>
        </Avatar>

        <p>{sessionData?.user?.name}</p>
      </div>

      <Button onClick={() => void signOut()}>Sign Out</Button>
    </div>
  );
};

export default Dashboard;