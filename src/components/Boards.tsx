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

const Boards = ({ currentBoardId }: BoardsProps) => {
  const { data: boards } = api.board.getAll.useQuery();

  return (
    <Sheet key="boards-sheet">
      <SheetTrigger asChild>
        <Button
          className="absolute"
          variant="blur"
          size="lg"
          data-testid="open-boards-btn"
        >
          My Boards <ChevronRightIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>My Boards</SheetTitle>
          <SheetDescription>
            Manage your boards. {boards?.length}
          </SheetDescription>
          <CreateBoard />
        </SheetHeader>
        <div className="flex flex-col gap-1 pt-3">
          {boards?.map((board) => (
            <Button
              key={board.id}
              asChild
              variant={currentBoardId === board.id ? "secondary" : "ghost"}
              size="lg"
            >
              <Link href={`/b/${board.id}`} data-testid="board-link">
                {board.title}
              </Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Boards;
