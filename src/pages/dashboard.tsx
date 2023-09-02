import { type GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";

import ListForm from "@/components/ListForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";

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

  const { data: lists } = api.list.getAll.useQuery();

  return (
    <main className="min-h-screen pt-16">
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

      <ListForm />

      <div>
        <p>The lists</p>
        {lists?.map((list) => (
          <p key={list.id}>{list.title}</p>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;
