import CreateNote from "@/components/CreateNote";
import Note from "@/components/Note";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type RouterOutputs } from "@/utils/api";

type ListProps = { list: RouterOutputs["list"]["getById"] };

const List = ({ list }: ListProps) => {
  const { data: notes } = api.note.getAll.useQuery({ listId: list.id });

  return (
    <Card className="w-full shrink-0 lg:w-80">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-md">{list.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {notes ? (
          notes.map((note) => {
            return <Note key={note.id} note={note} />;
          })
        ) : (
          <p>Loading...</p>
        )}
        <CreateNote listId={list.id} />
      </CardContent>
    </Card>
  );
};

export default List;
