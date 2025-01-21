import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isWeb =
  typeof window !== "undefined" &&
  typeof window.HTMLElement !== "undefined" &&
  typeof document !== "undefined";

  export const formatLog = (value: any) =>
  console.log(JSON.stringify(value, null, 2));