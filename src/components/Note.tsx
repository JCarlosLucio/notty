import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/utils/api";

type NoteProps = { note: RouterOutputs["note"]["create"] };

const Note = ({ note }: NoteProps) => {
  return (
    <Button variant="blur">
      <span className="w-full text-start">{note.content}</span>
    </Button>
  );
};

export default Note;
