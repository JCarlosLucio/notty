import { SortableContext } from "@dnd-kit/sortable";

import Note from "@/components/Note";
import { api } from "@/utils/api";

type ListNotesProps = { listId: string };

const ListNotes = ({ listId }: ListNotesProps) => {
  const { data: notes, isLoading } = api.note.getAll.useQuery({ listId });

  return (
    <>
      {notes && (
        <SortableContext items={notes}>
          {isLoading ? (
            <p>Loading...</p>
          ) : notes.length > 0 ? (
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
