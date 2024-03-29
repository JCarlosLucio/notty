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
import { updateNoteSchema } from "@/utils/schemas";

type UpdateNoteProps = {
  note: RouterOutputs["note"]["getById"];
  cb?: () => void;
} & ComponentPropsWithoutRef<"div">;
type UpdateNoteInput = RouterInputs["note"]["update"];

const UpdateNote = ({ note, cb }: UpdateNoteProps) => {
  const form = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      content: note.content,
      id: "",
    },
  });
  const { toast } = useToast();
  const ctx = api.useUtils();

  const { mutate: updateNote, isLoading } = api.note.update.useMutation({
    onSuccess: (updatedNote) => {
      ctx.note.getAll.setData({ listId: note.listId }, (oldNotes) => {
        return oldNotes
          ? oldNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
          : oldNotes;
      });
      form.reset();
      toast({
        description: "Your note was updated.",
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

  const onSubmit: SubmitHandler<UpdateNoteInput> = (values) => {
    values.id = note.id;
    updateNote(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Your new note content..."
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

export default UpdateNote;
