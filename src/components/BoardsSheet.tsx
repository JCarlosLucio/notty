import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";

import CreateBoard from "@/components/CreateBoard";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Sheet,
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

type BoardsProps = {
  currentBoardId?: string;
};

const BoardsSheet = ({ currentBoardId }: BoardsProps) => {
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
          className="absolute ml-5 mt-3 inline-flex px-5 md:px-8"
          variant="gradient"
          size="lg"
          data-testid="open-boards-btn"
        >
          <span className="hidden md:inline-block">My Boards</span>
          <ChevronRightIcon className="h-[1.5rem] w-[1.5rem]" />
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
          <SearchInput
            id="boards-sheet-query"
            type="search"
            value={query}
            placeholder="Search boards"
            onChange={(e) => setQuery(e.target.value)}
            clear={() => setQuery("")}
            data-testid="search-boards-sheet-input"
          />
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
            {(isLoading || isFetchingNextPage) &&
              Array.from({ length: INFINITE_BOARDS_LIMIT / 2 }, (_, index) => (
                <Skeleton key={index} className="h-10 rounded-md" />
              ))}
            {hasNextPage && !isFetching && (
              <Button
                variant="outline"
                size="sm"
                disabled={isFetching}
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
