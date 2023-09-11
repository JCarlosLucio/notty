import { type ComponentPropsWithoutRef } from "react";

import { type RouterOutputs } from "@/utils/api";

import CreateNote from "./CreateNote";

type ListDetailsProps = {
  list: RouterOutputs["list"]["getById"];
} & ComponentPropsWithoutRef<"div">;

const ListDetails = ({ list, ...props }: ListDetailsProps) => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      {...props}
    >
      <div className="flex w-full flex-col gap-4 lg:w-1/3">
        <h1 className="text-center text-5xl">{list.title}</h1>
        <span className="text-center text-sm text-primary">
          {list.updatedAt.toDateString()}
        </span>

        <CreateNote listId={list.id} />
      </div>
    </div>
  );
};

export default ListDetails;
