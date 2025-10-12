import { type SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

function Logo({ title = "logo", titleId = "logo", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="260"
      height="260"
      viewBox="0 0 68.791668 68.791667"
      aria-labelledby={titleId}
      role="img"
      {...props}
    >
      <title id={titleId}>{title}</title>
      <g id="layer1">
        <rect width="15" height="68.628128" x="0.44051394" y="0.19509754" />
        <rect width="15" height="53.377323" x="53.462322" y="15.327191" />
        <rect width="15" height="15" x="14.659732" y="15.188025" />
        <rect width="24.243999" height="15" x="29.290852" y="0.1845367" />
      </g>
    </svg>
  );
}

export default Logo;
