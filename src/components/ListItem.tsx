import { Cross2Icon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api, type RouterOutputs } from "@/utils/api";

type ListItemProps = {
  list: RouterOutputs["list"]["create"];
} & ComponentPropsWithoutRef<"p">;

const ListItem = ({ list, ...props }: ListItemProps) => {
  const ctx = api.useUtils();

  const { mutate: deleteList, isPending } = api.list.delete.useMutation({
    onSuccess: (deletedListId) => {
      ctx.list.getAll.setData({ boardId: list.boardId }, (oldList) => {
        return oldList && deletedListId
          ? oldList.filter((list) => list.id !== deletedListId)
          : oldList;
      });
      toast.success("Your list was deleted.");
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  return (
    <p {...props}>
      {list.title}
      <Button
        variant="destructive"
        size="icon"
        onClick={() => deleteList({ id: list.id })}
        disabled={isPending}
      >
        <Cross2Icon />
      </Button>
    </p>
  );
};

export default ListItem;
