import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
      listId: "",
      content: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useContext();

  const { mutate: createNote, isLoading } = api.note.create.useMutation({
    onSuccess: (createdNote) => {
      ctx.note.getAll.setData({ listId }, (oldNotes) => {
        return oldNotes && createdNote ? [...oldNotes, createdNote] : oldNotes;
      });
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
    values.listId = listId;
    createNote(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input placeholder="Add note" {...field} />
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

export default CreateNote;
