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


export function Header({isSignedIn, setIsSignedIn}: HeaderProps){
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
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="p-2">{localStorage.getItem('username')}</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}