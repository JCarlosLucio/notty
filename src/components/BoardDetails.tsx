import { type ComponentPropsWithoutRef } from "react";

import CreateBoard from "@/components/CreateBoard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="w-full lg:w-1/3">
        <CardHeader>
          <CardTitle className="text-center text-5xl">
            {board?.title ?? "Board not found"}
          </CardTitle>
          <CardDescription className="text-center">
            {board?.updatedAt.toDateString() ?? "Create one?"}
          </CardDescription>
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
