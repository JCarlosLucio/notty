import { Pencil1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type RouterOutputs } from "@/utils/api";

type NoteDetailsProps = {
  note: RouterOutputs["note"]["getById"];
} & ButtonProps;

const NoteDetails = ({ note, ...props }: NoteDetailsProps) => {
  const [showUpdateNote, setShowUpdateNote] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" {...props}>
          <Pencil1Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        {showUpdateNote ? (
          <div className="flex flex-row items-end gap-2">
            <div className="w-full">{/* TODO: Add UpdateNote component */}</div>
            <Button
              variant="destructive"
              onClick={() => setShowUpdateNote(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <DialogHeader>
            <div className="flex flex-row gap-2">
              <DialogTitle className="text-2xl">{note.content}</DialogTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowUpdateNote(true)}
              >
                <Pencil1Icon />
              </Button>
            </div>
            <DialogDescription>
              {note.updatedAt.toDateString()}
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetails;
