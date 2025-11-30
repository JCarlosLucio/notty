import { Loader2 } from "lucide-react";

import { api } from "@/utils/api";

import { CircularProgress } from "./ui/circular-progress";

type ListProgressProps = { listId: string };

function ListProgress({ listId }: ListProgressProps) {
  const { data: notes, isLoading } = api.note.getAll.useQuery({
    listId,
  });

  const notesDoneCount =
    notes?.reduce((acc, cur) => acc + (cur.done ? 1 : 0), 0) ?? 0;
  const notesProgress = notes ? (notesDoneCount / notes.length) * 100 : NaN;
  const notesProgressTooltip = notes ? `${notesDoneCount}/${notes.length}` : "";

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (isNaN(notesProgress)) {
    return null;
  }

  return (
    <CircularProgress
      value={notesProgress}
      size={20}
      strokeWidth={3}
      tooltip={notesProgressTooltip}
    />
  );
}

export default ListProgress;
