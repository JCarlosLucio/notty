import { type GetServerSideProps } from "next";
import Link from "next/link";

import BoardsSheet from "@/components/BoardsSheet";
import CreateBoard from "@/components/CreateBoard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/config";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";

const LIMIT = 5;

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
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isInitialLoading,
    isFetchingNextPage,
  } = api.board.getInfinite.useInfiniteQuery(
    {
      limit: LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <>
      <Header title="Dashboard" />

      <main className="min-h-screen pb-5 pt-16">
        <BoardsSheet />
        <div className="flex w-full flex-col items-center gap-8 xl:gap-12">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col gap-4 pt-4 lg:w-1/3 xl:pt-0">
              <h1 className="text-center text-3xl xl:text-5xl">
                Your dashboard
              </h1>
              <div className="px-5">
                <CreateBoard />
              </div>
            </div>
          </div>

          {data?.pages[0]?.boards && data.pages[0].boards?.length === 0 && (
            <div className="flex flex-col items-center">
              <p className="text-xl">No boards yet. 😅</p>
              <p className="text-xl">
                When you <em>add</em> new boards they will show up here!
              </p>
            </div>
          )}
          <div className="grid w-5/6 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {data?.pages.map((pageData) =>
              pageData.boards.map((board) => (
                <Button key={board.id} asChild variant="ghost" size="2xl">
                  <Link
                    href={`/b/${board.id}`}
                    className="overflow-hidden border hover:border-primary"
                    style={{
                      backgroundImage: board.thumb ?? "",
                      backgroundSize: "cover",
                    }}
                    data-testid="board-link"
                  >
                    <div className="flex h-full w-full items-center justify-center bg-card/50 p-3 text-2xl font-semibold hover:backdrop-blur-sm">
                      <span className="truncate">{board.title}</span>
                    </div>
                  </Link>
                </Button>
              )),
            )}
            {(isInitialLoading || isFetchingNextPage) &&
              Array.from({ length: LIMIT }, (_, index) => (
                <Skeleton key={index} className="h-44 rounded-md" />
              ))}
          </div>
          {hasNextPage && (
            <Button
              variant="outline"
              size="lg"
              className="text-muted-foreground"
              onClick={() => fetchNextPage()}
            >
              Show More
            </Button>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
