import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
import { api } from "@/utils/api";

type ListsProps = {
  currentListId?: string;
};

const Lists = ({ currentListId }: ListsProps) => {
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
        <div className="flex flex-col gap-1 pt-3">
          {lists?.map((list) => (
            <Button
              key={list.id}
              asChild
              variant={currentListId === list.id ? "secondary" : "ghost"}
              size="lg"
            >
              <Link href={`/dashboard/${list.id}`}>{list.title}</Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Lists;
