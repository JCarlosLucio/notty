import { Pencil1Icon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef, useState } from "react";

import DeleteList from "@/components/DeleteList";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateList from "@/components/UpdateList";
import { type RouterOutputs } from "@/utils/api";

type ListDetailsProps = {
  list: RouterOutputs["list"]["getById"];
} & ComponentPropsWithoutRef<"div">;

const ListDetails = ({ list, ...props }: ListDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [showUpdateList, setShowUpdateList] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild data-testid="open-list-details-btn">
        <CardHeader
          className="group flex shrink-0 cursor-pointer flex-row rounded-t-xl bg-secondary/70 p-3"
          style={{ backgroundColor: list.color ?? "" }}
          {...props}
        >
          <CardTitle className="w-full truncate pl-3 text-center text-xl">
            {list.title}
          </CardTitle>
          <Pencil1Icon className="visible group-hover:visible xl:invisible" />
        </CardHeader>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-full shrink-0 p-0 sm:max-w-2xl"
        data-no-dnd="true"
      >
        {showUpdateList ? (
          <UpdateList list={list} cb={() => setShowUpdateList(false)} />
        ) : (
          <div className="flex w-full flex-col gap-4">
            <DialogHeader
              className="flex flex-col rounded-t-md p-6 pb-3"
              style={{ backgroundColor: list.color ?? undefined }}
            >
              <div className="flex flex-row gap-2">
                <DialogTitle className="text-2xl">{list.title}</DialogTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowUpdateList(true)}
                  aria-label="Show update list form"
                  data-testid="show-update-list-btn"
                >
                  <Pencil1Icon />
                </Button>
              </div>
              <DialogDescription className="text-start">
                {list.updatedAt.toDateString()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="p-6 pt-0">
              <DeleteList list={list} cb={() => setOpen(false)} />
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ListDetails;
