import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/utils";

type SearchInputProps = InputProps & { clear?: () => void };

const SearchInput = ({
  className,
  value,
  clear,
  ...props
}: SearchInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <search className={cn("relative flex w-full items-center", className)}>
      <Label htmlFor="query" className="absolute pl-3">
        <MagnifyingGlassIcon />
      </Label>
      <Input ref={ref} className="pl-9" {...props} />
      {clear && value !== "" && (
        <Button
          type="reset"
          className="absolute right-6 h-7 w-7 p-0"
          variant="ghost"
          onClick={() => {
            clear();
            if (ref?.current) {
              ref.current.value = "";
            }
          }}
        >
          <Cross2Icon />
        </Button>
      )}
    </search>
  );
};

export default SearchInput;
