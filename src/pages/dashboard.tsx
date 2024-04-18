import { type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

import BoardsSheet from "@/components/BoardsSheet";
import CreateBoard from "@/components/CreateBoard";
import { Button } from "@/components/ui/button";
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
  const { data, fetchNextPage, hasNextPage } =
    api.board.getInfinite.useInfiniteQuery(
      {
        limit: 5,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <main className="min-h-screen pb-5 pt-16">
        <BoardsSheet />
        <div className="flex w-full flex-col items-center gap-12">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col gap-4 lg:w-1/3">
              <h1 className="text-center text-5xl">Your dashboard</h1>

              <CreateBoard />
            </div>
          </div>

          <div className="grid w-5/6 grid-cols-4 gap-5">
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
                    <div className="flex h-full w-full items-center justify-center bg-card/50 p-3 text-2xl font-semibold hover:bg-card/30">
                      <span className="truncate">{board.title}</span>
                    </div>
                  </Link>
                </Button>
              )),
            )}
            {hasNextPage && (
              <Button
                variant="ghost"
                size="2xl"
                onClick={() => fetchNextPage()}
              >
                Load more
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
