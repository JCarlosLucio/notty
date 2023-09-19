import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
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
import { createListSchema } from "@/utils/schemas";

type CreateListInput = RouterInputs["list"]["create"];
type CreateListProps = { boardId: string };

const CreateList = ({ boardId }: CreateListProps) => {
  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      boardId,
      title: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useContext();

  const { mutate: createList, isLoading } = api.list.create.useMutation({
    onSuccess: (createdList) => {
      ctx.list.getAll.setData({ boardId }, (oldList) => {
        return oldList && createdList ? [createdList, ...oldList] : oldList;
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
    createList(values);
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
                  <Input placeholder="Your list title..." {...field} />
                  <Button
                    type="submit"
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
  );
};

export default CreateList;
