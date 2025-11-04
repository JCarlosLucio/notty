import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

import BoardLists from "@/components/BoardLists";
import BoardsSheet from "@/components/BoardsSheet";
import BoardsSkeleton from "@/components/BoardsSkeleton";
import Nav from "@/components/Nav";
import Header from "@/config";
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

function BoardPage() {
  const router = useRouter();
  const boardId = router.query.boardId ?? "";
  const id = Array.isArray(boardId) ? (boardId[0] ?? "") : boardId;

  const { data: currentBoard, isLoading } = api.board.getById.useQuery({ id });

  return (
    <>
      <Header title={currentBoard?.title} />
      <Nav board={currentBoard} />
      <main
        className="relative flex h-screen min-h-screen flex-col gap-4 pt-16"
        style={
          currentBoard && {
            backgroundImage: currentBoard.bg ?? "",
            backgroundSize: "cover",
          }
        }
        data-testid="current-board"
      >
        <BoardsSheet currentBoardId={currentBoard?.id} />
        {isLoading && <BoardsSkeleton />}
        {currentBoard && <BoardLists boardId={id} />}
      </main>
    </>
  );
}

export default BoardPage;
