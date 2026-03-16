import { type ComponentProps, useState } from "react";

import CreateBoard from "@/components/CreateBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateBoard from "@/components/UpdateBoard";
import { type RouterOutputs } from "@/utils/api";

type BoardDetailsProps = {
  board?: RouterOutputs["board"]["getById"];
} & ComponentProps<"div">;

function BoardDetails({ board, ...props }: BoardDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card {...props}>
      {board ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild data-testid="open-board-details-btn">
            <CardHeader className="group border-primary-foreground hover:bg-accent/50 flex max-w-56 cursor-pointer flex-row rounded-xl border p-2 text-xl md:text-2xl xl:max-w-3xl">
              <CardTitle className="truncate px-3 py-1 xl:px-5">
                {board.title}
              </CardTitle>
            </CardHeader>
          </DialogTrigger>
          <DialogContent className="flex max-h-full shrink-0 overflow-y-scroll sm:max-w-2xl lg:max-w-4xl xl:overflow-auto">
            <DialogTitle className="hidden">
              Updating &quot;{board.title}&quot;
            </DialogTitle>
            <DialogDescription className="hidden">
              Update board title and background.
            </DialogDescription>
            <UpdateBoard board={board} cb={() => setOpen(false)} />
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
}

export default BoardDetails;
