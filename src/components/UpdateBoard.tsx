import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type ComponentPropsWithoutRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import ColorsTab from "@/components/ColorsTab";
import PhotosTab from "@/components/PhotosTab";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      bg: "",
      thumb: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useUtils();

  const [bg, setBg] = useState<{ full: string | null; thumb: string | null }>({
    full: board.bg,
    thumb: board.thumb,
  });

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
    values.bg = bg.full;
    values.thumb = bg.thumb;
    updateBoard(values);
  };

  return (
    <Form {...form}>
      <form
        className="flex max-h-full w-full shrink-0 flex-col gap-4"
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
        <div className="flex flex-col items-center gap-2">
          <h6 className="text-sm">Current background</h6>
          <div
            className="group flex h-52 w-full items-center justify-center rounded-lg border"
            style={{
              backgroundImage: bg.thumb ?? "",
              backgroundSize: "cover",
            }}
            data-testid="bg-preview"
          >
            <Button
              type="button"
              size="lg"
              variant="destructive"
              className="invisible group-hover:visible"
              onClick={() => setBg({ full: null, thumb: null })}
            >
              Remove
            </Button>
          </div>
        </div>

        <Tabs defaultValue="colors" className="flex flex-col overflow-y-hidden">
          <TabsList>
            <TabsTrigger
              value="colors"
              className="w-full"
              data-testid="colors-tab"
            >
              Colors
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="w-full"
              data-testid="photos-tab"
            >
              <span>
                Photos by{" "}
                <Link
                  className="hover:underline"
                  href="https://unsplash.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Unsplash
                </Link>
              </span>
            </TabsTrigger>
          </TabsList>
          <ColorsTab setBg={setBg} />
          <PhotosTab setBg={setBg} />
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
