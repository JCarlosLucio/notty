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
      <Lists />
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col gap-4 lg:w-1/3">
          <h1 className="text-center text-5xl">Your dashboard</h1>

          <CreateList />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
