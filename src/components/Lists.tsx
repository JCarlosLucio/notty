import { Cross2Icon } from "@radix-ui/react-icons";

import CreateList from "@/components/CreateList";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";

const Lists = () => {
  const { data: lists } = api.list.getAll.useQuery();

  const { toast } = useToast();
  const ctx = api.useContext();

  const { mutate: deleteList } = api.list.delete.useMutation({
    onSuccess: (deletedListId) => {
      ctx.list.getAll.setData(undefined, (oldList) => {
        return oldList && deletedListId
          ? oldList.filter((list) => list.id !== deletedListId)
          : oldList;
      });
      toast({
        description: "Your list was deleted.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    },
  });

  return (
    <>
      <Sheet key="lists-sheet">
        <SheetTrigger asChild>
          <Button variant="outline">My Lists</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>My Lists</SheetTitle>
            <SheetDescription>
              Manage your lists. {lists?.length}
            </SheetDescription>
            <CreateList />
          </SheetHeader>
          <div>
            {lists?.map((list) => (
              <p key={list.id}>
                {list.title}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteList({ id: list.id })}
                >
                  <Cross2Icon />
                </Button>
              </p>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Lists;
