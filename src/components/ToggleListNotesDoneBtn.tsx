import { Square, SquareCheck } from "lucide-react";

import Spinner from "@/components/Spinner";
import { Toggle } from "@/components/ui/toggle";
import { api, type RouterOutputs } from "@/utils/api";
import { cn } from "@/utils/utils";

type ToggleListNotesDoneBtnProps = {
  listId: string;
  className: string | undefined;
};

function ToggleListNotesDoneBtn({
  listId,
  className,
}: ToggleListNotesDoneBtnProps) {
  const { data: notes, isLoading } = api.note.getAll.useQuery({
    listId,
  });

  const ctx = api.useUtils();

  const someNotDone = notes?.some((n) => !n.done) ?? false;

  const { mutate: toggleListNotesDone, isPending: isToggling } =
    api.list.toggleListNotesDone.useMutation({
      onSuccess: (updatedNotes, { id: listId }) => {
        ctx.note.getAll.setData({ listId }, (oldNotes) => {
          if (oldNotes) {
            const updatedNotesMap = updatedNotes.reduce(
              (acc, curr) => acc.set(curr.id, curr),
              new Map<string, RouterOutputs["note"]["getById"]>(),
            );
            return oldNotes.map((n) => updatedNotesMap.get(n.id) ?? n);
          }
          return oldNotes;
        });
      },
    });

  const handleToggleListNotesDone = () => {
    toggleListNotesDone({ id: listId });
  };

  return (
    <Toggle
      pressed={!someNotDone}
      size="sm"
      onPressedChange={handleToggleListNotesDone}
      className={cn("bg-accent data-[state=on]:bg-emerald-500", className)}
      data-testid="note-done-toggle-btn"
      disabled={isToggling}
    >
      {isLoading || isToggling ? (
        <Spinner />
      ) : !someNotDone ? (
        <SquareCheck />
      ) : (
        <Square />
      )}
      ALL NOTES DONE
    </Toggle>
  );
}

export default ToggleListNotesDoneBtn;
