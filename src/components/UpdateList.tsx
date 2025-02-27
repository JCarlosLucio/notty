import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, type MouseEventHandler } from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

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
  const ctx = api.useUtils();

  const { mutate: updateList, isPending } = api.list.update.useMutation({
    onSuccess: (updatedList) => {
      ctx.list.getAll.setData({ boardId: list.boardId }, (oldList) => {
        return oldList
          ? oldList.map((l) => (l.id === updatedList.id ? updatedList : l))
          : oldList;
      });
      form.reset();
      toast.success("Your list was updated.");
      cb?.();
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const onSubmit: SubmitHandler<UpdateListInput> = (values) => {
    values.id = list.id;
    updateList(values);
  };

  const handleRemoveColor: MouseEventHandler<HTMLButtonElement> = () => {
    form.setValue("color", null, { shouldDirty: true });
  };

  return (
    <div className="flex max-h-full w-full shrink-0 p-6">
      <div className="flex max-h-full w-full">
        <Form {...form}>
          <form
            className="flex max-h-full w-full flex-col gap-4 overflow-y-scroll xl:overflow-auto"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full px-[1px]">
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
                  <div className="flex flex-col justify-evenly gap-6 rounded-lg border p-6 md:flex-row">
                    <div className="flex flex-col justify-center gap-3">
                      <h6 className="text-sm">Preview</h6>
                      <div
                        className="flex h-24 w-full items-start justify-end rounded-lg border md:w-40"
                        style={{ backgroundColor: value ?? undefined }}
                      >
                        {value ? (
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="m-3"
                            onClick={handleRemoveColor}
                            aria-label="Remove color"
                          >
                            <XIcon />
                          </Button>
                        ) : (
                          <span className="m-auto text-xs italic">None</span>
                        )}
                      </div>
                    </div>
                    <FormControl>
                      <div className="flex flex-col items-center gap-3">
                        <HexAlphaColorPicker
                          color={value ?? undefined}
                          onChange={onChange}
                          onBlur={onBlur}
                        />
                        <HexColorInput
                          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                          alpha
                          prefixed
                          color={value ?? undefined}
                          onChange={onChange}
                          onBlur={onBlur}
                        />
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 md:flex-row">
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
                isLoading={isPending}
                className="w-full"
                data-testid="save-list-btn"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={cb}
                data-testid="cancel-update-list-btn"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateList;
