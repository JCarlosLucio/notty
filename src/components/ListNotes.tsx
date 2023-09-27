import Note from "@/components/Note";
import { api } from "@/utils/api";

type ListNotesProps = { listId: string };

const ListNotes = ({ listId }: ListNotesProps) => {
  const { data: notes } = api.note.getAll.useQuery({ listId });

  return (
    <>
      {notes ? (
        notes.map((note) => <Note key={note.id} note={note} />)
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ListNotes;
