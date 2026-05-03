import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** clsx + tailwind-merge — the combo every shadcn component leans on. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
