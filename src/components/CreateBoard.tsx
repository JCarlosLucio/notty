import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { type MouseEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useClickAway from "@/hooks/useClickAway";
import { api, type RouterInputs } from "@/utils/api";
import { createBoardSchema } from "@/utils/schemas";

type CreateBoardInput = RouterInputs["board"]["create"];

function CreateBoard() {
  const form = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: "",
    },
  });
  const [show, setShow] = useState(false);
  const innerRef = useClickAway<HTMLDivElement>(() => {
    if (show) {
      setShow(false);
    }
  });

  const ctx = api.useUtils();
  const router = useRouter();

  const { mutate: createBoard, isPending } = api.board.create.useMutation({
    onSuccess: (createdBoard) => {
      ctx.board.getInfinite.setInfiniteData({ query: "" }, (oldPageData) => {
        return oldPageData
          ? {
              ...oldPageData,
              pages: oldPageData.pages.map((page, i) => {
                return i === 0
                  ? { ...page, boards: [createdBoard, ...page.boards] }
                  : page;
              }),
            }
          : oldPageData;
      });

      // invalidates all other board infinite queries where created board title includes the query
      // https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
      void ctx.board.getInfinite.invalidate(
        {},
        {
          predicate: (query) => {
            if (!query.queryKey[1]?.input?.query) {
              return false;
            }
            return createdBoard.title.includes(query.queryKey[1].input.query);
          },
        },
      );
      form.reset();
      toast.success("Your board was created.");
      void router.push(`/b/${createdBoard.id}`, undefined, {
        shallow: true,
      });
    },
    onError: () => {
      toast.error("Something went wrong...");
    },
  });

  const onSubmit: SubmitHandler<CreateBoardInput> = (values) => {
    createBoard(values);
  };

  const handleShowForm = (e: MouseEvent) => {
    e.stopPropagation(); // stops triggering click away
    setShow(true);
  };

  if (!show) {
    return (
      <Button
        size="lg"
        className="w-full shrink-0"
        onClick={handleShowForm}
        data-testid="show-add-board-btn"
      >
        <span className="inline-flex items-center gap-2">
          <PlusIcon />
          <span>Add Board</span>
        </span>
      </Button>
    );
  }

  return (
    <div ref={innerRef} className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Add Board</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Your board title..."
                      data-testid="board-input"
                      {...field}
                    />
                    <Button
                      type="submit"
                      disabled={isPending}
                      isLoading={isPending}
                      data-testid="create-board-btn"
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default CreateBoard;
