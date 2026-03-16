import { PencilIcon } from "lucide-react";
import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateNote from "@/components/UpdateNote";
import { type RouterOutputs } from "@/utils/api";

type NoteDetailsProps = {
  note: RouterOutputs["note"]["getById"];
} & ButtonProps;

function NoteDetails({ note, ...props }: NoteDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild data-testid="open-note-details-btn">
        <Button variant="ghost" size="icon" {...props}>
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-full shrink-0 overflow-y-scroll sm:max-w-2xl lg:max-w-5xl xl:overflow-auto"
        data-no-dnd="true"
      >
        <DialogTitle className="hidden">
          Updating &quot;{note.title}&quot;
        </DialogTitle>
        <DialogDescription className="hidden">
          Update note title and content.
        </DialogDescription>
        <UpdateNote note={note} cb={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default NoteDetails;
