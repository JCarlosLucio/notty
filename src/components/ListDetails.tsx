import { type ComponentPropsWithoutRef } from "react";

import CreateNote from "@/components/CreateNote";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type RouterOutputs } from "@/utils/api";

type ListDetailsProps = {
  list: RouterOutputs["list"]["getById"];
} & ComponentPropsWithoutRef<"div">;

const ListDetails = ({ list, ...props }: ListDetailsProps) => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      {...props}
    >
      <Card className="w-full lg:w-1/3">
        <CardHeader>
          <CardTitle className="text-center text-5xl">{list.title}</CardTitle>
          <CardDescription className="text-center">
            {list.updatedAt.toDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateNote listId={list.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ListDetails;
