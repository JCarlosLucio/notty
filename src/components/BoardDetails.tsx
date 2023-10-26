import { Pencil1Icon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef, useState } from "react";

import CreateBoard from "@/components/CreateBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [showUpdateBoard, setShowUpdateBoard] = useState(false);

  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      {...props}
    >
      <Card>
        {board ? (
          <Dialog>
            <DialogTrigger asChild>
              <CardHeader className="group flex cursor-pointer flex-row rounded-xl bg-secondary/70 p-3">
                <CardTitle className="pl-6 pr-2 text-center text-2xl">
                  {board.title}
                </CardTitle>
                <Pencil1Icon className="invisible group-hover:visible" />
              </CardHeader>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              {showUpdateBoard ? (
                <div className="flex flex-row items-end gap-2">
                  <div className="w-full">
                    <UpdateBoard
                      board={board}
                      cb={() => setShowUpdateBoard(false)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowUpdateBoard(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <DialogHeader>
                  <div className="flex flex-row gap-2">
                    <DialogTitle className="text-2xl">
                      {board.title}
                    </DialogTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowUpdateBoard(true)}
                    >
                      <Pencil1Icon />
                    </Button>
                  </div>
                  <DialogDescription>
                    {board.updatedAt.toDateString()}
                  </DialogDescription>
                </DialogHeader>
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
