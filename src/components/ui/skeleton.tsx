import { cn } from "@/utils/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-secondary/40 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
