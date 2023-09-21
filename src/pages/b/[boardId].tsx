import { type GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import BoardDetails from "@/components/BoardDetails";
import Boards from "@/components/Boards";
import CreateList from "@/components/CreateList";
import List from "@/components/List";
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

const BoardPage = () => {
  const router = useRouter();
  const boardId = router.query.boardId ?? "";
  const id = Array.isArray(boardId) ? (boardId[0] ? boardId[0] : "") : boardId;

  const { data: currentBoard } = api.board.getById.useQuery({ id });
  const { data: lists } = api.list.getAll.useQuery({ boardId: id });

  return (
    <>
      <Head>
        <title>{currentBoard?.title}</title>
      </Head>

      <main className="min-h-screen pt-16">
        <Boards currentBoardId={currentBoard?.id} />

        {currentBoard && <BoardDetails board={currentBoard} />}

        <div className="flex items-start gap-2 py-4">
          {lists?.map((list) => {
            return <List key={list.id} list={list} />;
          })}
          <CreateList boardId={id} />
        </div>
      </main>
    </>
  );
};

export default BoardPage;
