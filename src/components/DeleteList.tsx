import { TrashIcon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api, type RouterOutputs } from "@/utils/api";

type DeleteListProps = {
  list: RouterOutputs["list"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;

const DeleteList = ({ list, cb }: DeleteListProps) => {
  const ctx = api.useUtils();

  const { mutate: deleteList, isPending } = api.list.delete.useMutation({
    onSuccess: () => {
      ctx.list.getAll.setData({ boardId: list.boardId }, (oldLists) => {
        return oldLists ? oldLists.filter((li) => li.id !== list.id) : oldLists;
      });
      toast.success("Your list was deleted.");
      cb?.();
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild data-testid="open-delete-list-modal-btn">
        <Button variant="destructive">
          <TrashIcon className="pr-1" width={24} height={24} />
          Delete List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your list{" "}
            <strong>{list.title}</strong> and <strong>all the notes</strong> it
            contains.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col xl:flex-row">
          <DialogClose asChild>
            <Button
              variant="destructive"
              disabled={isPending}
              isLoading={isPending}
              className="min-w-36"
              onClick={() => deleteList({ id: list.id })}
              data-testid="delete-list-forever-btn"
            >
              <TrashIcon className="pr-1" width={24} height={24} />
              Delete Forever
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteList;
