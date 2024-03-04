import { type GetServerSideProps } from "next";
import Head from "next/head";

import Boards from "@/components/Boards";
import CreateBoard from "@/components/CreateBoard";
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
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <main className="min-h-screen pt-16">
        <Boards />
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-full flex-col gap-4 lg:w-1/3">
            <h1 className="text-center text-5xl">Your dashboard</h1>

            <CreateBoard />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
