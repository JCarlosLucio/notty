import { zodResolver } from "@hookform/resolvers/zod";
import { Cross1Icon } from "@radix-ui/react-icons";
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
import { INFINITE_BOARDS_LIMIT } from "@/utils/constants";
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

  const { mutate: updateBoard, isPending } = api.board.update.useMutation({
    onSuccess: (updatedBoard) => {
      ctx.board.getInfinite.setInfiniteData(
        { limit: INFINITE_BOARDS_LIMIT },
        (oldPageData) => {
          return oldPageData
            ? {
                ...oldPageData,
                pages: oldPageData.pages.map((page, i) => {
                  const filteredPage = {
                    ...page,
                    boards: page.boards.filter((b) => b.id !== updatedBoard.id),
                  };

                  return i === 0
                    ? {
                        ...filteredPage,
                        boards: [updatedBoard, ...filteredPage.boards],
                      }
                    : filteredPage;
                }),
              }
            : oldPageData;
        },
      );
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
    <div className="flex max-h-full w-full shrink-0">
      <div className="flex max-h-full w-full">
        <Form {...form}>
          <form
            className="flex max-h-full w-full flex-col gap-4 overflow-y-scroll xl:overflow-auto"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Update Title</FormLabel>
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
                className="flex h-36 w-full items-start justify-end rounded-lg border xl:h-52"
                style={{
                  backgroundImage: bg.thumb ?? "",
                  backgroundSize: "cover",
                }}
                data-testid="bg-preview"
              >
                {bg.thumb ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="m-3"
                    onClick={() => setBg({ full: null, thumb: null })}
                    aria-label="Remove background"
                  >
                    <Cross1Icon />
                  </Button>
                ) : (
                  <span className="m-auto text-xs italic">None</span>
                )}
              </div>
            </div>

            <Tabs
              defaultValue="colors"
              className="flex flex-col xl:overflow-y-hidden"
            >
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
            <div className="flex flex-col gap-2 md:flex-row">
              <Button
                type="submit"
                disabled={isPending}
                isLoading={isPending}
                className="w-full"
                data-testid="save-board-btn"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={cb}
                className=""
                data-testid="cancel-update-board-btn"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateBoard;
