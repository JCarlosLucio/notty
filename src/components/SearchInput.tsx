import { Search, XIcon } from "lucide-react";
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
        <Search size={20} />
      </Label>
      <Input ref={ref} className="pl-10" {...props} />
      {clear && value !== "" && (
        <Button
          type="reset"
          className="absolute right-0.5 rounded-sm"
          variant="ghost"
          size="icon"
          onClick={() => {
            clear();
            if (ref?.current) {
              ref.current.value = "";
            }
          }}
        >
          <XIcon />
        </Button>
      )}
    </search>
  );
};

export default SearchInput;
