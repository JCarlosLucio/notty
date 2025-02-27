import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/router";
import { type ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

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
import { api, type RouterOutputs } from "@/utils/api";

type DeleteBoardProps = {
  board: RouterOutputs["board"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;

const DeleteBoard = ({ board, cb }: DeleteBoardProps) => {
  const ctx = api.useUtils();
  const router = useRouter();

  const { mutate: deleteBoard, isPending } = api.board.delete.useMutation({
    onSuccess: () => {
      ctx.board.getInfinite.setInfiniteData({ query: "" }, (oldPageData) => {
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
      });

      // invalidates all other board infinite queries where deleted board title includes the query
      // https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
      void ctx.board.getInfinite.invalidate(
        {},
        {
          predicate: (query) => {
            if (!query.queryKey[1]?.input?.query) {
              return false;
            }
            return board.title.includes(query.queryKey[1].input.query);
          },
        },
      );
      toast.success("Your board was deleted.");
      cb?.();
      void router.push(`/dashboard`, undefined, {
        shallow: true,
      });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild data-testid="open-delete-board-modal-btn">
        <Button variant="destructive">
          <Trash2Icon className="pr-1" />
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
              disabled={isPending}
              isLoading={isPending}
              className="min-w-36"
              onClick={() => deleteBoard({ id: board.id })}
              data-testid="delete-board-forever-btn"
            >
              <Trash2Icon className="pr-1" />
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
