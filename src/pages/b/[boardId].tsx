import { type GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import BoardDetails from "@/components/BoardDetails";
import BoardLists from "@/components/BoardLists";
import Boards from "@/components/Boards";
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

  const { data: currentBoard, isLoading } = api.board.getById.useQuery({ id });

  return (
    <>
      <Head>
        <title>{currentBoard?.title}</title>
      </Head>

      <main
        className="relative flex h-screen min-h-screen flex-col gap-4 pt-20"
        style={{
          backgroundImage: "url(https://picsum.photos/1920/1080)",
          backgroundSize: "cover",
        }}
      >
        <Boards currentBoardId={currentBoard?.id} />

        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <BoardDetails board={currentBoard} />
        )}

        {currentBoard && <BoardLists boardId={id} />}
      </main>
    </>
  );
};

export default BoardPage;
