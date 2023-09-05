import { type GetServerSideProps } from "next";

import CreateList from "@/components/CreateList";
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
  const { data: lists } = api.list.getAll.useQuery();

  return (
    <main className="min-h-screen pt-16">
      <CreateList />

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
