import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/utils";

const SearchInput = ({ className, ...props }: InputProps) => {
  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Label htmlFor="query" className="absolute pl-3">
        <MagnifyingGlassIcon />
      </Label>
      <Input className="pl-9" {...props} />
    </div>
  );
};

export default SearchInput;
