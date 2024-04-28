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
import Spinner from "@/components/Spinner";

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
    <div className="flex flex-row items-end gap-2">
      <div className="w-full">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Update Content</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Your new note content..."
                        autoFocus
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 md:flex-row">
              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full"
              >
                Save
              </Button>
              <Button type="button" variant="ghost" onClick={cb}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateNote;
