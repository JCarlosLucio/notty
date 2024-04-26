import { cn } from "@/utils/utils";
import { SVGProps } from "react";

const Spinner = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("origin-center animate-spin", className)}
      {...props}
    >
      <path d="M2,12A11.2,11.2,0,0,1,13,1.05C12.67,1,12.34,1,12,1a11,11,0,0,0,0,22c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z" />
    </svg>
  );
};

export default Spinner;
