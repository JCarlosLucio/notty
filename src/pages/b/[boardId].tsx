import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

import BoardDetails from "@/components/BoardDetails";
import BoardLists from "@/components/BoardLists";
import BoardsSheet from "@/components/BoardsSheet";
import { Skeleton } from "@/components/ui/skeleton";
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

const BoardPage = () => {
  const router = useRouter();
  const boardId = router.query.boardId ?? "";
  const id = Array.isArray(boardId) ? (boardId[0] ? boardId[0] : "") : boardId;

  const { data: currentBoard, isLoading } = api.board.getById.useQuery({ id });

  return (
    <>
      <Header title={currentBoard?.title} />

      <main
        className="relative flex h-screen min-h-screen flex-col gap-4 pt-20"
        style={
          currentBoard && {
            backgroundImage: currentBoard.bg ?? "",
            backgroundSize: "cover",
          }
        }
        data-testid="current-board"
      >
        <BoardsSheet currentBoardId={currentBoard?.id} />

        <div className="flex w-full items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-12 w-1/2 rounded-xl xl:w-1/5" />
          ) : (
            <BoardDetails board={currentBoard} />
          )}
        </div>

        {currentBoard && <BoardLists boardId={id} />}
      </main>
    </>
  );
};

export default BoardPage;
