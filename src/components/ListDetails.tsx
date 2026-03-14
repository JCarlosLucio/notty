import { PencilIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";

import ListProgress from "@/components/ListProgress";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateList from "@/components/UpdateList";
import { type RouterOutputs } from "@/utils/api";

type ListDetailsProps = {
  list: RouterOutputs["list"]["getById"];
} & ComponentProps<"div">;

function ListDetails({ list, ...props }: ListDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CardHeader
        className="group bg-secondary/70 flex shrink-0 flex-row items-center rounded-t-xl p-2"
        style={{ backgroundColor: list.color ?? "" }}
        {...props}
      >
        <ListProgress listId={list.id} />
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
        className="flex max-h-full shrink-0 overflow-y-scroll sm:max-w-2xl lg:max-w-4xl xl:overflow-auto"
        data-no-dnd="true"
      >
        <DialogTitle className="hidden">
          Updating &quot;{list.title}&quot;
        </DialogTitle>
        <DialogDescription className="hidden">
          Update list title and color.
        </DialogDescription>
        <UpdateList list={list} cb={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default ListDetails;
