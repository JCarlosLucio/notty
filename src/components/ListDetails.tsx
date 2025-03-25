import { PencilIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";

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
} & ComponentProps<"div">;

const ListDetails = ({ list, ...props }: ListDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [showUpdateList, setShowUpdateList] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CardHeader
        className="group bg-secondary/70 flex shrink-0 flex-row items-center rounded-t-xl p-2"
        style={{ backgroundColor: list.color ?? "" }}
        {...props}
      >
        <CardTitle className="w-full truncate pl-3 text-center text-lg md:text-xl">
          {list.title}
        </CardTitle>
        <DialogTrigger asChild data-testid="open-list-details-btn">
          <Button variant="ghost" size="icon">
            <PencilIcon className="visible group-hover:visible xl:invisible" />
          </Button>
        </DialogTrigger>
      </CardHeader>
      <DialogContent
        className="flex max-h-full shrink-0 p-0 sm:max-w-2xl lg:max-w-4xl"
        data-no-dnd="true"
      >
        {showUpdateList ? (
          <>
            <DialogTitle className="hidden">
              Updating &quot;{list.title}&quot;
            </DialogTitle>
            <DialogDescription className="hidden">
              Update list title and color.
            </DialogDescription>
            <UpdateList list={list} cb={() => setShowUpdateList(false)} />
          </>
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
                  <PencilIcon />
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
