import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/utils/api";

type NoteProps = { note: RouterOutputs["note"]["create"] };

const Note = ({ note }: NoteProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
    data: {
      type: "Note",
      note,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Button
      ref={setNodeRef}
      variant="blur"
      className={isDragging ? "border-2 border-destructive" : ""}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span className="w-full text-start">{note.content}</span>
    </Button>
  );
};

export default Note;
