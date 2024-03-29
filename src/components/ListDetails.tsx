import { Pencil1Icon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [showUpdateList, setShowUpdateList] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild data-testid="open-list-details-btn">
        <CardHeader
          className="group flex shrink-0 cursor-pointer flex-row rounded-t-xl bg-secondary/70 p-3"
          style={{ backgroundColor: list.color ?? "" }}
          {...props}
        >
          <CardTitle className="w-full truncate pl-3 text-center text-xl">
            {list.title}
          </CardTitle>
          <Pencil1Icon className="invisible group-hover:visible" />
        </CardHeader>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-2xl" data-no-dnd="true">
        {showUpdateList ? (
          <div className="flex flex-row items-end gap-2 p-6">
            <div className="w-full">
              <UpdateList list={list} cb={() => setShowUpdateList(false)} />
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowUpdateList(false)}
              data-testid="cancel-update-list-btn"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <DialogHeader>
            <div
              className="flex flex-row gap-2 rounded-t-md p-6 pb-3"
              style={{ backgroundColor: list.color ?? undefined }}
            >
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
            <DialogDescription className="p-6 pt-3">
              {list.updatedAt.toDateString()}
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ListDetails;
