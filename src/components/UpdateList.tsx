import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
  useState,
} from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";
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
import Spinner from "@/components/Spinner";

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
  const [showUpdateColor, setShowUpdateColor] = useState<boolean>(!!list.color);
  const { toast } = useToast();
  const ctx = api.useUtils();

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

  const handleAddColor: MouseEventHandler<HTMLButtonElement> = () => {
    setShowUpdateColor(true);
  };

  const handleRemoveColor: MouseEventHandler<HTMLButtonElement> = () => {
    form.setValue("color", null, { shouldDirty: true });
    setShowUpdateColor(false);
  };

  return (
    <div className="flex flex-row items-end gap-2 p-6">
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
                    {showUpdateColor ? (
                      <>
                        <div className="flex flex-col justify-center gap-3">
                          <h6 className="text-sm">Preview</h6>
                          <div
                            className="flex h-20 w-full items-center justify-center rounded-full border"
                            style={{ backgroundColor: value ?? undefined }}
                          ></div>
                          <Button type="button" onClick={handleRemoveColor}>
                            Remove color
                          </Button>
                        </div>
                        <FormControl>
                          <div className="flex flex-col items-center gap-3">
                            <HexAlphaColorPicker
                              color={value ?? undefined}
                              onChange={onChange}
                              onBlur={onBlur}
                            />
                            <HexColorInput
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              alpha
                              prefixed
                              color={value ?? undefined}
                              onChange={onChange}
                              onBlur={onBlur}
                            />
                          </div>
                        </FormControl>
                      </>
                    ) : (
                      <Button onClick={handleAddColor}>Add color</Button>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 md:flex-row">
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
                isLoading={isLoading}
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
