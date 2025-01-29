"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
      router.push("/signin");
    }
  }, []);

  return (

    <div className="w-screen flex flex-col justify-center items-center">
      <div className="w-1/3 flex justify-between h-[10vh]">
        <div className="flex jusify-center items-center">
          <Label>Name</Label>
        </div>
        <div className="flex jusify-center items-center">
          <Header isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn}/>
        </div>
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center gap-10 bg-muted h-[90vh]">
        <Link href="/createproduct">
          <Button>Create Product</Button>
        </Link>
        <Link href='/allcars'>
          <Button>List All Product</Button>
        </Link>
      </div>
    </div>
  );
}
