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
import { updateListSchema } from "@/utils/schemas";

type UpdateListProps = {
  list: RouterOutputs["list"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;
type UpdateListInput = RouterInputs["list"]["update"];

const UpdateList = ({ list, cb }: UpdateListProps) => {
  const form = useForm<UpdateListInput>({
    resolver: zodResolver(updateListSchema),
    defaultValues: {
      title: list.title,
      id: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useContext();

  const { mutate: updateList, isLoading } = api.list.update.useMutation({
    onSuccess: (updatedList) => {
      ctx.list.getAll.setData({ boardId: list.boardId }, (oldList) => {
        return oldList
          ? oldList.map((l) => (l.id === updatedList.id ? updatedList : l))
          : oldList;
      });
      form.reset();
      toast({
        description: "Your list was updated.",
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

  const onSubmit: SubmitHandler<UpdateListInput> = (values) => {
    values.id = list.id;
    updateList(values);
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
                    placeholder="Your new list title..."
                    autoFocus
                    {...field}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={isLoading ? "animate-pulse" : ""}
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

export default UpdateList;
