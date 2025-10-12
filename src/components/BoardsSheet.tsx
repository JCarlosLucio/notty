import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import CreateBoard from "@/components/CreateBoard";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import { api } from "@/utils/api";
import { INFINITE_BOARDS_LIMIT } from "@/utils/constants";
import { cn } from "@/utils/utils";

type BoardsProps = {
  currentBoardId?: string;
};

function BoardsSheet({ currentBoardId }: BoardsProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = api.board.getInfinite.useInfiniteQuery(
    {
      query: debouncedQuery,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <Sheet key="boards-sheet">
      <SheetTrigger asChild>
        <Button
          className="absolute mt-3 ml-5 inline-flex px-5 md:px-8"
          variant="gradient"
          size="lg"
          data-testid="open-boards-btn"
        >
          <span className="hidden md:inline-block">My Boards</span>
          <ChevronRightIcon className="h-[1.5rem] w-[1.5rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>My Boards</SheetTitle>
          <SheetDescription>
            Manage your boards.{" "}
            {data?.pages.reduce((acc, cur) => acc + cur.boards.length, 0)}
          </SheetDescription>
          <div className="flex flex-col gap-2">
            <SearchInput
              id="boards-sheet-query"
              type="search"
              value={query}
              placeholder="Search boards"
              onChange={(e) => setQuery(e.target.value)}
              clear={() => setQuery("")}
              data-testid="search-boards-sheet-input"
            />
            <CreateBoard />
          </div>
        </SheetHeader>
        <div className="flex flex-col overflow-hidden p-4 hover:overflow-y-scroll">
          <div className="flex w-full flex-col gap-1">
            {data?.pages.map((pageData) =>
              pageData.boards.map((board) => (
                <SheetClose asChild key={board.id}>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="px-0"
                  >
                    <Link
                      href={`/b/${board.id}`}
                      className={cn(
                        "hover:border-primary overflow-hidden hover:border",
                        currentBoardId === board.id && "border-primary border",
                      )}
                      style={{
                        backgroundImage: board.thumb ?? "",
                        backgroundSize: "cover",
                      }}
                      data-testid="board-link"
                    >
                      <div className="bg-card/70 flex h-full w-full items-center justify-center px-8 hover:backdrop-blur-xs">
                        <span className="truncate">{board.title}</span>
                      </div>
                    </Link>
                  </Button>
                </SheetClose>
              )),
            )}
            {(isLoading || isFetchingNextPage) &&
              Array.from({ length: INFINITE_BOARDS_LIMIT / 2 }, (_, index) => (
                <Skeleton key={index} className="h-10 rounded-md" />
              ))}
            {hasNextPage && !isFetching && (
              <Button
                variant="outline"
                size="sm"
                disabled={isFetching}
                className="text-muted-foreground w-max self-center"
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
}

export default BoardsSheet;
