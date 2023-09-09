import { type GetServerSideProps } from "next";

import CreateList from "@/components/CreateList";
import Lists from "@/components/Lists";
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
  return (
    <main className="min-h-screen pt-16">
      <h1>Your dashboard</h1>
      <CreateList />
      <Lists />
    </main>
  );
};

export default Dashboard;
