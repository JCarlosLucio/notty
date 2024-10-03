import { SortableContext } from "@dnd-kit/sortable";

import Note from "@/components/Note";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { getRandomArbitrary } from "@/utils/utils";

type ListNotesProps = { listId: string };

const ListNotes = ({ listId }: ListNotesProps) => {
  const { data: notes, isLoading } = api.note.getAll.useQuery({ listId });

  if (isLoading) {
    return (
      <>
        {Array.from({ length: getRandomArbitrary(2, 6) }, (_, index) => (
          <Skeleton key={index} className="h-12 shrink-0 rounded-md border" />
        ))}
      </>
    );
  }

  return (
    <>
      {notes && (
        <SortableContext items={notes}>
          {notes.length > 0 ? (
            notes.map((note) => <Note key={note.id} note={note} />)
          ) : (
            <div className="rounded-xl border border-dashed border-secondary-foreground p-3 opacity-60">
              <p className="text-center">
                You can Drag N&apos; Drop 👋 notes here or Add a new note 👇
              </p>
            </div>
          )}
        </SortableContext>
      )}
    </>
  );
};

export default ListNotes;
