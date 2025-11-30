"use client";

import { cn } from "@/utils/utils";

type CircularProgressProps = {
  value: number;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: "square" | "round";
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
  tooltip?: string;
};

function CircularProgress({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel,
  shape = "round",
  size = 100,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
  tooltip,
}: CircularProgressProps) {
  const radius =
    (size - (strokeWidth ?? Math.max(circleStrokeWidth, progressStrokeWidth))) /
    2;
  const circumference = Math.ceil(Math.PI * radius * 2);
  const percentage = Math.ceil(circumference * ((100 - value) / 100));
  const halfSize = size / 2;
  const viewBox = `${0} ${0} ${size} ${size}`;

  return (
    <div className="relative" title={tooltip ?? value.toString()}>
      <svg
        role="progressbar"
        width={size}
        height={size}
        viewBox={viewBox}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)" }}
        className="relative"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Base Circle */}
        <circle
          r={radius}
          cx={halfSize}
          cy={halfSize}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          className={cn("stroke-primary/25", className)}
        />

        {/* Progress */}
        <circle
          r={radius}
          cx={halfSize}
          cy={halfSize}
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDashoffset={percentage}
          fill="transparent"
          strokeDasharray={circumference}
          className={cn("stroke-primary", progressClassName)}
        />
      </svg>
      {showLabel && (
        <div
          className={cn(
            "text-md absolute inset-0 flex items-center justify-center",
            labelClassName,
          )}
        >
          {renderLabel ? renderLabel(value) : value}
        </div>
      )}
    </div>
  );
}

export { CircularProgress };
