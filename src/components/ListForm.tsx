import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

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
import { api } from "@/utils/api";

const ListSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

const ListForm = () => {
  const form = useForm<z.infer<typeof ListSchema>>({
    resolver: zodResolver(ListSchema),
    defaultValues: {
      title: "",
    },
  });

  const { refetch: refetchList } = api.list.getAll.useQuery();

  const { mutate: createList, isLoading } = api.list.create.useMutation({
    onSuccess: (_data) => {
      void refetchList();
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof ListSchema>> = (
    values: z.infer<typeof ListSchema>
  ) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    createList(values, {
      onSuccess: (_data) => {
        form.reset();
        alert("list added");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Your list title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="animate-pulse">Submiting...</span>
          ) : (
            <span>Submit</span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ListForm;
