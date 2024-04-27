import { cn } from "@/utils/utils";
import { Component1Icon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

const Spinner = ({ className, ...props }: IconProps) => {
  return (
    <Component1Icon
      className={cn("origin-center animate-spin", className)}
      {...props}
    />
  );
};

export default Spinner;
