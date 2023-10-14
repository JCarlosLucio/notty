import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { type MouseEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

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
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  const ctx = api.useContext();

  const { mutate: createList, isLoading } = api.list.create.useMutation({
    onSuccess: (createdList) => {
      ctx.list.getAll.setData({ boardId }, (oldList) => {
        return oldList && createdList ? [...oldList, createdList] : oldList;
      });
      form.reset();
      toast({
        description: "Your list was created.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
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
      <Button size="lg" className="w-72" onClick={handleShowForm}>
        <span className="inline-flex items-center gap-2">
          <PlusIcon />
          <span>Add List</span>
        </span>
      </Button>
    );
  }

  return (
    <Card
      ref={innerRef}
      className="flex max-h-full w-full shrink-0 flex-col bg-card-foreground/60 text-card lg:w-72"
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
                      <Input placeholder="Add list" autoFocus {...field} />
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={isLoading}
                        className={isLoading ? "animate-pulse" : ""}
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
