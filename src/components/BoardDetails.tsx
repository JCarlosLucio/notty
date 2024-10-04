import { Pencil1Icon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef, useState } from "react";

import CreateBoard from "@/components/CreateBoard";
import DeleteBoard from "@/components/DeleteBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateBoard from "@/components/UpdateBoard";
import { type RouterOutputs } from "@/utils/api";

type BoardDetailsProps = {
  board?: RouterOutputs["board"]["getById"];
} & ComponentPropsWithoutRef<"div">;

const BoardDetails = ({ board, ...props }: BoardDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [showUpdateBoard, setShowUpdateBoard] = useState(false);

  return (
    <Card {...props}>
      {board ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild data-testid="open-board-details-btn">
            <CardHeader className="group flex max-w-56 cursor-pointer flex-row rounded-xl border border-primary-foreground p-2 text-xl hover:bg-accent/50 md:text-2xl xl:max-w-3xl">
              <CardTitle className="truncate py-1 pl-3 xl:pl-8">
                {board.title}
              </CardTitle>
              <div className="px-2 py-1">
                <Pencil1Icon className="visible group-hover:visible xl:invisible" />
              </div>
            </CardHeader>
          </DialogTrigger>
          <DialogContent className="flex max-h-full shrink-0 sm:max-w-2xl">
            {showUpdateBoard ? (
              <UpdateBoard board={board} cb={() => setShowUpdateBoard(false)} />
            ) : (
              <div className="flex w-full flex-col gap-4">
                <DialogHeader>
                  <div className="mr-2 flex flex-row gap-2">
                    <DialogTitle className="text-start text-2xl">
                      {board.title}
                    </DialogTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowUpdateBoard(true)}
                      aria-label="Show update board form"
                      data-testid="show-update-board-btn"
                    >
                      <Pencil1Icon />
                    </Button>
                  </div>
                  <DialogDescription className="text-start">
                    {board.updatedAt.toDateString()}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DeleteBoard board={board} cb={() => setOpen(false)} />
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <CardHeader className="flex flex-row justify-center p-3">
          <CardTitle className="text-center text-2xl">
            Board not found
          </CardTitle>
        </CardHeader>
      )}
      {!board && (
        <CardContent>
          <CreateBoard />
        </CardContent>
      )}
    </Card>
  );
};

export default BoardDetails;
