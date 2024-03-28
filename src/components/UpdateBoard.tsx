import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentPropsWithoutRef, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { api, type RouterInputs, type RouterOutputs } from "@/utils/api";
import { gradients } from "@/utils/gradients";
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
      bg: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useUtils();

  const [gradient, setGradient] = useState<string | null>(board.bg);

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
    values.bg = gradient;
    updateBoard(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your new board title..."
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Update bg (gradient / photos) */}
        <Tabs
          defaultValue="colors"
          className="flex w-full flex-col justify-center"
        >
          <TabsList>
            <TabsTrigger value="colors" className="w-full">
              Colors
            </TabsTrigger>
            <TabsTrigger value="photos" className="w-full">
              Photos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="colors">
            <div className="flex justify-center gap-10 rounded-lg border p-4">
              <div className="flex flex-col items-center gap-3 p-3">
                <h6 className="text-sm">Current gradient</h6>

                <div
                  className="flex h-20 w-full items-center justify-center rounded-full border"
                  style={{ background: gradient ? gradient : "" }}
                />
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setGradient(null)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid w-full grid-cols-3 grid-rows-3 gap-2">
                {gradients.map((gradient) => (
                  <Button
                    type="button"
                    key={gradient.id}
                    size="lg"
                    variant="outline"
                    style={{ background: gradient.bg }}
                    onClick={() => setGradient(gradient.bg)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="photos">Change your password here.</TabsContent>
        </Tabs>
        <Button
          type="submit"
          disabled={isLoading}
          className={isLoading ? "animate-pulse" : ""}
          data-testid="save-board-btn"
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

export default UpdateBoard;
