import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a random number between the specified values.
 * The returned value is no lower than (and may possibly equal) min, and is less than (and not equal) max.
 * @param min The minimum value (inclusive).
 * @param max The maximum value (non inclusive).
 * @returns A random number between the min and max values.
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
