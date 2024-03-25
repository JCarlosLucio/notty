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
import { updateBoardSchema } from "@/utils/schemas";

type UpdateBoardProps = {
  board: RouterOutputs["board"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;
type UpdateBoardInput = RouterInputs["board"]["update"];

const gradientVariants: { id: string; name: string; bg: string }[] = [
  {
    id: "expresso",
    name: "eXpresso",
    bg: "linear-gradient(to left, #ad5389, #3c1053)",
  },
  {
    id: "lawrencium",
    name: "Lawrencium",
    bg: "linear-gradient(to left, #0f0c29, #302b63, #24243e)",
  },
  {
    id: "argon",
    name: "Argon",
    bg: "linear-gradient(to bottom, #03001e, #7303c0, #ec38bc, #fdeff9)",
  },
  {
    id: "earth",
    name: "Earth",
    bg: "linear-gradient(to bottom, #00c9ff, #92fe9d)",
  },
  {
    id: "eternal",
    name: "Eternal",
    bg: "linear-gradient(to bottom, #09203f 0%, #537895 100%)",
  },
  {
    id: "electric",
    name: "Electric",
    bg: "linear-gradient(to top, #4776e6, #8e54e9)",
  },
  {
    id: "love-kiss",
    name: "Love Kiss",
    bg: "linear-gradient(to top, #ff0844 0%, #ffb199 100%)",
  },
  {
    id: "twilight",
    name: "Twilight",
    bg: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  },
  {
    id: "cool",
    name: "Cool",
    bg: "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
  },
  {
    id: "cute",
    name: "Cute",
    bg: "linear-gradient(to right, #00dbde 0%, #fc00ff 100%)",
  },
  {
    id: "sky",
    name: "Sky",
    bg: "linear-gradient(to bottom, #0acffe 0%, #495aff 100%)",
  },
  {
    id: "salt",
    name: "Salt",
    bg: "linear-gradient(to top, #FFFEFF 0%, #D7FFFE 100%)",
  },
  {
    id: "magic",
    name: "Magic",
    bg: "linear-gradient(-225deg, #FF3CAC 0%, #562B7C 52%, #2B86C5 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    bg: "linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%)",
  },
];

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

  const [gradient, setGradient] = useState<string | null>(null);

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
                >
                  <p>{gradient ? gradient : "None"}</p>
                </div>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setGradient(null)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-3 grid-rows-3 gap-2">
                {gradientVariants.map((gradient) => (
                  <Button
                    type="button"
                    key={gradient.id}
                    size="lg"
                    variant="outline"
                    style={{ background: gradient.bg }}
                    onClick={() => setGradient(gradient.name)}
                  >
                    {gradient.name}
                  </Button>
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
