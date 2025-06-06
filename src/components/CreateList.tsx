import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { createListSchema } from "@/utils/schemas";

type CreateListInput = RouterInputs["list"]["create"];
type CreateListProps = { boardId: string };

const CreateList = ({ boardId }: CreateListProps) => {
  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      boardId: "",
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

  const { mutate: createList, isPending } = api.list.create.useMutation({
    onSuccess: (createdList) => {
      ctx.list.getAll.setData({ boardId }, (oldList) => {
        return oldList && createdList ? [...oldList, createdList] : oldList;
      });
      form.reset();
      toast.success("Your list was created.");
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const onSubmit: SubmitHandler<CreateListInput> = (values) => {
    values.boardId = boardId;
    createList(values);
  };

  const handleShowForm = (e: MouseEvent) => {
    e.stopPropagation(); // stops triggering click away
    setShow(true);
  };

  if (!show) {
    return (
      <Button
        variant="blur"
        size="xl"
        className="w-72 shrink-0 rounded-xl"
        onClick={handleShowForm}
        data-testid="show-add-list-btn"
      >
        <span className="inline-flex items-center gap-2 text-lg">
          <PlusIcon />
          <span>Add List</span>
        </span>
      </Button>
    );
  }

  return (
    <Card
      ref={innerRef}
      className="bg-card/60 flex max-h-full w-full shrink-0 flex-col lg:w-72"
    >
      <CardContent className="flex flex-col gap-2 overflow-hidden p-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full lg:max-w-7xl">
                  <FormLabel className="font-bold">Add List</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add list"
                        autoFocus
                        data-testid="list-input"
                        {...field}
                      />
                      <Button
                        type="submit"
                        disabled={isPending}
                        isLoading={isPending}
                        data-testid="create-list-btn"
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
      </CardContent>
    </Card>
  );
};

export default CreateList;
