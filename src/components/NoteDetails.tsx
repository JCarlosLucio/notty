import { Pencil1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

import DeleteNote from "@/components/DeleteNote";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateNote from "@/components/UpdateNote";
import { type RouterOutputs } from "@/utils/api";

type NoteDetailsProps = {
  note: RouterOutputs["note"]["getById"];
} & ButtonProps;

const NoteDetails = ({ note, ...props }: NoteDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [showUpdateNote, setShowUpdateNote] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" {...props}>
          <Pencil1Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl" data-no-dnd="true">
        {showUpdateNote ? (
          <UpdateNote note={note} cb={() => setShowUpdateNote(false)} />
        ) : (
          <>
            <DialogHeader>
              <div className="mr-2 flex flex-row gap-2">
                <DialogTitle className="text-start text-2xl">
                  {note.content}
                </DialogTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowUpdateNote(true)}
                >
                  <Pencil1Icon />
                </Button>
              </div>
              <DialogDescription className="text-start">
                {note.updatedAt.toDateString()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DeleteNote note={note} cb={() => setOpen(false)} />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetails;
