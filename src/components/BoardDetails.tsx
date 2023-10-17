import { Pencil1Icon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef } from "react";

import CreateBoard from "@/components/CreateBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { type RouterOutputs } from "@/utils/api";

type BoardDetailsProps = {
  board?: RouterOutputs["board"]["getById"];
} & ComponentPropsWithoutRef<"div">;

const BoardDetails = ({ board, ...props }: BoardDetailsProps) => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      {...props}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 px-3 py-3">
          <CardTitle className="text-center text-2xl">
            {board?.title ?? "Board not found"}
          </CardTitle>
          {board && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil1Icon />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]"></DialogContent>
            </Dialog>
          )}
        </CardHeader>
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
