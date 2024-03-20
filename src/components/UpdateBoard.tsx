import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentPropsWithoutRef } from "react";
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
import { api, type RouterInputs, type RouterOutputs } from "@/utils/api";
import { updateBoardSchema } from "@/utils/schemas";

type UpdateBoardProps = {
  board: RouterOutputs["board"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;
type UpdateBoardInput = RouterInputs["board"]["update"];

const UpdateBoard = ({ board, cb }: UpdateBoardProps) => {
  const form = useForm<UpdateBoardInput>({
    resolver: zodResolver(updateBoardSchema),
    defaultValues: {
      title: board.title,
      id: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useUtils();

  const { mutate: updateBoard, isLoading } = api.board.update.useMutation({
    onSuccess: (updatedBoard) => {
      ctx.board.getAll.setData(undefined, (oldBoard) => {
        return oldBoard
          ? oldBoard.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
          : oldBoard;
      });
      ctx.board.getById.setData({ id: board.id }, () => {
        return updatedBoard;
      });
      form.reset();
      toast({
        description: "Your board was updated.",
      });
      cb?.();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateBoardInput> = (values) => {
    values.id = board.id;
    updateBoard(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Your new board title..."
                    autoFocus
                    {...field}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={isLoading ? "animate-pulse" : ""}
                    data-testid="save-board-btn"
                  >
                    Save
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

export default UpdateBoard;
