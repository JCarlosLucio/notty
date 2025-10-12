import { Trash2Icon } from "lucide-react";
import { type ComponentProps } from "react";
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

type DeleteNoteProps = {
  note: RouterOutputs["note"]["getById"];
  cb?: () => void;
} & ComponentProps<"div">;

function DeleteNote({ note, cb }: DeleteNoteProps) {
  const ctx = api.useUtils();

  const { mutate: deleteNote, isPending } = api.note.delete.useMutation({
    onSuccess: () => {
      ctx.note.getAll.setData({ listId: note.listId }, (oldNotes) => {
        return oldNotes ? oldNotes.filter((n) => n.id !== note.id) : oldNotes;
      });
      toast.success("Your note was deleted.");
      cb?.();
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild data-testid="open-delete-note-modal-btn">
        <Button variant="destructive">
          <Trash2Icon className="pr-1" />
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
              disabled={isPending}
              isLoading={isPending}
              className="min-w-36"
              onClick={() => deleteNote({ id: note.id })}
              data-testid="delete-note-forever-btn"
            >
              <Trash2Icon className="pr-1" />
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
}

export default DeleteNote;
