import { Component1Icon } from "@radix-ui/react-icons";
import { type IconProps } from "@radix-ui/react-icons/dist/types";

import { cn } from "@/utils/utils";

const Spinner = ({ className, ...props }: IconProps) => {
  return (
    <Component1Icon
      className={cn("origin-center animate-spin", className)}
      {...props}
    />
  );
};

export default Spinner;
