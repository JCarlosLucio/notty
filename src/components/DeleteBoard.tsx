import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { type ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { api, type RouterOutputs } from "@/utils/api";
import { INFINITE_BOARDS_LIMIT } from "@/utils/constants";

type DeleteBoardProps = {
  board: RouterOutputs["board"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;

const DeleteBoard = ({ board, cb }: DeleteBoardProps) => {
  const ctx = api.useUtils();
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: deleteBoard, isLoading } = api.board.delete.useMutation({
    onSuccess: () => {
      ctx.board.getInfinite.setInfiniteData(
        { limit: INFINITE_BOARDS_LIMIT },
        (oldPageData) => {
          return oldPageData
            ? {
                ...oldPageData,
                pages: oldPageData.pages.map((page) => {
                  return {
                    ...page,
                    boards: page.boards.filter((b) => b.id !== board.id),
                  };
                }),
              }
            : oldPageData;
        },
      );
      toast({
        description: "Your board was deleted.",
      });
      cb?.();
      void router.push(`/dashboard`, undefined, {
        shallow: true,
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
    <Dialog>
      <DialogTrigger asChild data-testid="open-delete-board-modal-btn">
        <Button variant="destructive">
          <TrashIcon className="pr-1" width={24} height={24} />
          Delete Board
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            board <strong>{board.title}</strong> and{" "}
            <strong>all the list and notes</strong> it contains.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col xl:flex-row">
          <DialogClose asChild>
            <Button
              variant="destructive"
              disabled={isLoading}
              isLoading={isLoading}
              className="min-w-36"
              onClick={() => deleteBoard({ id: board.id })}
              data-testid="delete-board-forever-btn"
            >
              <TrashIcon className="pr-1" width={24} height={24} />
              Delete Forever
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBoard;
