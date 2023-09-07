import { ChevronRightIcon } from "@radix-ui/react-icons";

import CreateList from "@/components/CreateList";
import ListItem from "@/components/ListItem";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/utils/api";

const Lists = () => {
  const { data: lists } = api.list.getAll.useQuery();

  return (
    <Sheet key="lists-sheet">
      <SheetTrigger asChild>
        <Button variant="secondary" size="lg">
          My Lists <ChevronRightIcon />
        </Button>
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
            <ListItem key={list.id} list={list} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Lists;
