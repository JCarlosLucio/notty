import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
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

const CreateList = () => {
  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      title: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useContext();
  const router = useRouter();

  const { mutate: createList, isLoading } = api.list.create.useMutation({
    onSuccess: async (createdList) => {
      ctx.list.getAll.setData(undefined, (oldList) => {
        return oldList && createdList ? [createdList, ...oldList] : oldList;
      });
      form.reset();
      toast({
        description: "Your list was created.",
      });
      await router.push(`/dashboard/${createdList.id}`, undefined, {
        shallow: true,
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end space-x-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Your list title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className={isLoading ? "animate-pulse" : ""}
        >
          <PlusIcon />
        </Button>
      </form>
    </Form>
  );
};

export default CreateList;
