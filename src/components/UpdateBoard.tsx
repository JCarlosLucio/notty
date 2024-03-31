import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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

  const [bg, setBg] = useState<string | null>(board.bg);

  const { data: images } = api.board.getImages.useQuery();

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
    values.bg = bg;
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
        <div className="flex flex-col items-center gap-3 p-3">
          <h6 className="text-sm">Current background</h6>
          <div
            className="flex h-52 w-full items-center justify-center rounded-lg border"
            style={{ backgroundImage: bg ?? "", backgroundSize: "cover" }}
          />
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setBg(null)}
          >
            Remove
          </Button>
        </div>

        <Tabs defaultValue="colors" className="flex flex-col overflow-hidden">
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
              <div className="grid w-full grid-cols-3 grid-rows-3 gap-2">
                {gradients.map((gradient) => (
                  <Button
                    type="button"
                    key={gradient.id}
                    size="lg"
                    variant="outline"
                    style={{ background: gradient.bg }}
                    onClick={() => setBg(gradient.bg)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="photos"
            className="flex overflow-hidden hover:overflow-y-scroll"
          >
            <div className="grid w-full grid-cols-3 gap-2">
              {images?.map((img) => (
                <Button
                  type="button"
                  key={img.id}
                  size="xl"
                  variant="outline"
                  className="flex shrink-0 flex-col justify-end"
                  style={{ background: `url(${img.urls.thumb})` }}
                  onClick={() => setBg(`url(${img.urls.full})`)}
                >
                  <Link
                    className="w-full bg-card/50 px-1 text-start"
                    href={img.user.links.html}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {img.user.username}
                  </Link>
                </Button>
              ))}
            </div>
          </TabsContent>
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
