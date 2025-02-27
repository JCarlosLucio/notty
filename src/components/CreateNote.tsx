import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useClickAway from "@/hooks/useClickAway";
import { api, type RouterInputs } from "@/utils/api";
import { createNoteSchema } from "@/utils/schemas";

type CreateNoteInput = RouterInputs["note"]["create"];
type CreateNoteProps = { listId: string };

const CreateNote = ({ listId }: CreateNoteProps) => {
  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      listId: "",
      title: "",
    },
  });
  const [show, setShow] = useState(false);
  const innerRef = useClickAway<HTMLDivElement>(() => {
    if (show) {
      setShow(false);
    }
  });

  const ctx = api.useUtils();

  const { mutate: createNote, isPending } = api.note.create.useMutation({
    onSuccess: (createdNote) => {
      ctx.note.getAll.setData({ listId }, (oldNotes) => {
        return oldNotes && createdNote ? [...oldNotes, createdNote] : oldNotes;
      });
      form.reset();
      toast.success("Your note was created.");
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const onSubmit: SubmitHandler<CreateNoteInput> = (values) => {
    values.listId = listId;
    createNote(values);
  };

  const handleShowForm = (e: MouseEvent) => {
    e.stopPropagation(); // stops triggering click away
    setShow(true);
  };

  if (!show) {
    return (
      <Button
        variant="ghost"
        className="w-full"
        onClick={handleShowForm}
        data-testid="show-add-note-btn"
      >
        <span className="inline-flex items-center gap-2">
          <PlusIcon />
          <span>Add Note</span>
        </span>
      </Button>
    );
  }

  return (
    <div ref={innerRef} className="w-full" data-no-dnd="true">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add note"
                      autoFocus
                      data-testid="note-input"
                      {...field}
                    />
                    <Button
                      type="submit"
                      disabled={isPending}
                      isLoading={isPending}
                      data-testid="create-note-btn"
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
    </div>
  );
};

export default CreateNote;
