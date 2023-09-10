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
import { createNoteSchema } from "@/utils/schemas";

type CreateNoteInput = RouterInputs["note"]["create"];
type CreateNoteProps = { listId: string };

const CreateNote = ({ listId }: CreateNoteProps) => {
  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      listId,
      content: "",
    },
  });
  const { toast } = useToast();

  const { mutate: createNote, isLoading } = api.note.create.useMutation({
    onSuccess: () => {
      form.reset();
      toast({
        description: "Your note was created.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    },
  });

  const onSubmit: SubmitHandler<CreateNoteInput> = (values) => {
    createNote(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end space-x-2"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Input placeholder="Your note..." {...field} />
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

export default CreateNote;
