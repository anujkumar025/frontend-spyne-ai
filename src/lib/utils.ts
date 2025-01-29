import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleLogout = () => {
  localStorage.removeItem('authToken');
  console.log('Logged out');
  // Redirect user or update UI
};

