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
    <div
      className="flex w-full flex-col items-center justify-center"
      {...props}
    >
      <Card>
        {board ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild data-testid="open-board-details-btn">
              <CardHeader className="group flex max-w-3xl cursor-pointer flex-row rounded-xl bg-secondary/70 p-2 text-2xl">
                <CardTitle className="truncate py-1 pl-8">
                  {board.title}
                </CardTitle>
                <div className="px-2">
                  <Pencil1Icon className="invisible group-hover:visible" />
                </div>
              </CardHeader>
            </DialogTrigger>
            <DialogContent className="flex max-h-full shrink-0 sm:max-w-2xl">
              {showUpdateBoard ? (
                <div className="flex max-h-full w-full shrink-0 flex-row items-end gap-2">
                  <div className="flex max-h-full w-full">
                    <UpdateBoard
                      board={board}
                      cb={() => setShowUpdateBoard(false)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowUpdateBoard(false)}
                    data-testid="cancel-update-board-btn"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex w-full flex-col">
                  <DialogHeader>
                    <div className="mx-2 flex flex-row gap-2">
                      <DialogTitle className="text-2xl">
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
                    <DialogDescription>
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
    </div>
  );
};

export default BoardDetails;
