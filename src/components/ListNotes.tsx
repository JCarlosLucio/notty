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
          ) : (
            notes.map((note) => <Note key={note.id} note={note} />)
          )}
        </SortableContext>
      )}
    </>
  );
};

export default ListNotes;
