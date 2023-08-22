import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

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
      <h1>This is your personal dashboard. {sessionData?.user?.name}</h1>
    </div>
  );
};

export default Dashboard;
