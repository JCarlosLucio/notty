import { type GetServerSideProps } from "next";

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

const ListPage = () => {
  return (
    <main className="min-h-screen pt-16">
      <Lists />
    </main>
  );
};

export default ListPage;
