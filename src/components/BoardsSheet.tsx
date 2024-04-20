import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import CreateBoard from "@/components/CreateBoard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/utils/api";

type BoardsProps = {
  currentBoardId?: string;
};

const BoardsSheet = ({ currentBoardId }: BoardsProps) => {
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
    <Sheet key="boards-sheet">
      <SheetTrigger asChild>
        <Button
          className="absolute ml-2"
          variant="gradient"
          size="lg"
          data-testid="open-boards-btn"
        >
          My Boards <ChevronRightIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col overflow-hidden">
        <SheetHeader>
          <SheetTitle>My Boards</SheetTitle>
          <SheetDescription>
            Manage your boards.{" "}
            {data?.pages.reduce((acc, cur) => acc + cur.boards.length, 0)}
          </SheetDescription>
          <CreateBoard />
        </SheetHeader>
        <div className="flex flex-col overflow-hidden pt-3 hover:overflow-y-scroll">
          <div className="flex w-full flex-col gap-1">
            {data?.pages.map((pageData) =>
              pageData.boards.map((board) => (
                <Button
                  key={board.id}
                  asChild
                  variant={currentBoardId === board.id ? "secondary" : "ghost"}
                  size="lg"
                >
                  <Link href={`/b/${board.id}`} data-testid="board-link">
                    <span className="truncate">{board.title}</span>
                  </Link>
                </Button>
              )),
            )}
            {hasNextPage && (
              <Button
                variant="outline"
                size="sm"
                className="w-max self-center text-muted-foreground"
                onClick={() => fetchNextPage()}
              >
                Show More
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BoardsSheet;