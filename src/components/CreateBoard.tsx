import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { type SubmitHandler, useForm } from "react-hook-form";

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
import { useToast } from "@/components/ui/use-toast";
import { api, type RouterInputs } from "@/utils/api";
import { INFINITE_BOARDS_LIMIT } from "@/utils/constants";
import { createBoardSchema } from "@/utils/schemas";

type CreateBoardInput = RouterInputs["board"]["create"];

const CreateBoard = () => {
  const form = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useUtils();
  const router = useRouter();

  const { mutate: createBoard, isPending } = api.board.create.useMutation({
    onSuccess: (createdBoard) => {
      ctx.board.getInfinite.setInfiniteData(
        { limit: INFINITE_BOARDS_LIMIT },
        (oldPageData) => {
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
        },
      );
      form.reset();
      toast({
        description: "Your board was created.",
      });
      void router.push(`/b/${createdBoard.id}`, undefined, {
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

  const onSubmit: SubmitHandler<CreateBoardInput> = (values) => {
    createBoard(values);
  };

  return (
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
                    autoFocus
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
  );
};

export default CreateBoard;
