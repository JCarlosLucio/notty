import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentPropsWithoutRef } from "react";
import { HexAlphaColorPicker } from "react-colorful";
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
      color: list.color,
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
                    placeholder="Your new list title..."
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
          name="color"
          render={({ field: { value, onChange, onBlur } }) => (
            <FormItem className="w-full">
              <FormLabel>Update Color</FormLabel>
              <div className="flex justify-center gap-20 rounded-lg border p-5">
                <div className="flex flex-col gap-3">
                  <h6>Current color</h6>
                  <div
                    className="h-10 w-full rounded-lg"
                    style={{ backgroundColor: value ?? undefined }}
                  />
                  <Button
                    type="button"
                    onClick={() => form.setValue("color", null)}
                  >
                    Remove color
                  </Button>
                </div>
                <FormControl>
                  <HexAlphaColorPicker
                    color={value ?? undefined}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className={isLoading ? "animate-pulse" : ""}
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

export default UpdateList;
