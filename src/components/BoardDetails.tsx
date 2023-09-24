import { type ComponentPropsWithoutRef } from "react";

import CreateBoard from "@/components/CreateBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardHeader className="px-3 py-2">
          <CardTitle className="text-center text-2xl">
            {board?.title ?? "Board not found"}
          </CardTitle>
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
