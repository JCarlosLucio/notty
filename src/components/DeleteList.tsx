import { TrashIcon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef } from "react";

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
import { useToast } from "@/components/ui/use-toast";
import { api, type RouterOutputs } from "@/utils/api";

type DeleteListProps = {
  list: RouterOutputs["list"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;

const DeleteList = ({ list, cb }: DeleteListProps) => {
  const ctx = api.useUtils();
  const { toast } = useToast();

  const { mutate: deleteList, isLoading } = api.list.delete.useMutation({
    onSuccess: () => {
      ctx.list.getAll.setData({ boardId: list.boardId }, (oldLists) => {
        return oldLists ? oldLists.filter((li) => li.id !== list.id) : oldLists;
      });
      toast({
        description: "Your list was deleted.",
      });
      cb?.();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
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
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={() => deleteList({ id: list.id })}
            >
              <TrashIcon className="pr-1" width={24} height={24} />
              {isLoading ? "Deleting..." : "Delete Forever"}
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
