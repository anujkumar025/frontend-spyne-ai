"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";



interface HeaderProps {
    isSignedIn: boolean;
    setIsSignedIn: (value: boolean) => void;
}


export function Header({ isSignedIn, setIsSignedIn }: HeaderProps) {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
  
    useEffect(() => {
      setUsername(localStorage.getItem("username"));
    }, [isSignedIn]);
  
    const handleSignOut = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      setIsSignedIn(false);
      router.push("/signin");
    };
  
    return (
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="px-4 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-2">
            <span className="i-lucide-user-circle text-xl" />
            <span className="font-medium">{username || "Account"}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel className="font-medium">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
            >
                <span className="i-lucide-log-out mr-2">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }