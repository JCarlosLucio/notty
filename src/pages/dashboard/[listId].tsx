import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

import CreateNote from "@/components/CreateNote";
import Lists from "@/components/Lists";
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

const ListPage = () => {
  const router = useRouter();
  const listId = router.query.listId ?? "";

  const { data: currentList } = api.list.getById.useQuery({
    id: Array.isArray(listId) ? (listId[0] ? listId[0] : "") : listId,
  });

  return (
    <main className="min-h-screen pt-16">
      <Lists currentListId={currentList?.id} />
      <h1>{currentList?.title}</h1>
      {currentList && <CreateNote listId={currentList.id} />}
    </main>
  );
};

export default ListPage;
