import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentProps } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, type RouterInputs, type RouterOutputs } from "@/utils/api";
import { MAX_CONTENT_LENGTH } from "@/utils/constants";
import { updateNoteSchema } from "@/utils/schemas";

type UpdateNoteProps = {
  note: RouterOutputs["note"]["getById"];
  cb?: () => void;
} & ComponentProps<"div">;
type UpdateNoteInput = RouterInputs["note"]["update"];

const UpdateNote = ({ note, cb }: UpdateNoteProps) => {
  const form = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      id: "",
    },
  });
  const ctx = api.useUtils();

  const { mutate: updateNote, isPending } = api.note.update.useMutation({
    onSuccess: (updatedNote) => {
      ctx.note.getAll.setData({ listId: note.listId }, (oldNotes) => {
        return oldNotes
          ? oldNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
          : oldNotes;
      });
      form.reset();
      toast.success("Your note was updated.");
      cb?.();
    },
    onError: () => {
      toast.error("Something went wrong.");
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
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Update Title</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Your new note title..."
                        autoFocus
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field: { value, ...fieldRest } }) => (
                <FormItem className="w-full">
                  <FormLabel>Update Content</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Textarea
                        className="h-56 md:h-96"
                        placeholder="Your new note content..."
                        value={value}
                        {...fieldRest}
                      />
                    </div>
                  </FormControl>
                  <FormDescription
                    style={
                      MAX_CONTENT_LENGTH - value.length < 1
                        ? { color: "red" }
                        : undefined
                    }
                  >
                    {`${MAX_CONTENT_LENGTH - value.length} character${MAX_CONTENT_LENGTH - value.length !== 1 ? "s" : ""} left.`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 md:flex-row">
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
                isLoading={isPending}
                className="w-full"
                data-testid="save-note-btn"
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
