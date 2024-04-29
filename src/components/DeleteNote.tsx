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

type DeleteNoteProps = {
  note: RouterOutputs["note"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;

const DeleteNote = ({ note, cb }: DeleteNoteProps) => {
  const ctx = api.useUtils();
  const { toast } = useToast();

  const { mutate: deleteNote, isLoading } = api.note.delete.useMutation({
    onSuccess: () => {
      ctx.note.getAll.setData({ listId: note.listId }, (oldNotes) => {
        return oldNotes ? oldNotes.filter((n) => n.id !== note.id) : oldNotes;
      });
      toast({
        description: "Your note was deleted.",
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
          Delete Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your note{" "}
            <strong>{note.content}</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col xl:flex-row">
          <DialogClose asChild>
            <Button
              variant="destructive"
              disabled={isLoading}
              isLoading={isLoading}
              className="min-w-36"
              onClick={() => deleteNote({ id: note.id })}
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

export default DeleteNote;
