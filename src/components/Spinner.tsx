import { LoaderPinwheelIcon, type LucideProps } from "lucide-react";

import { cn } from "@/utils/utils";

function Spinner({ className, ...props }: LucideProps) {
  return (
    <LoaderPinwheelIcon
      className={cn("origin-center animate-spin", className)}
      {...props}
    />
  );
}

export default Spinner;
