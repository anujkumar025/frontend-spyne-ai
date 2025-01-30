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
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 border-b">
        <div className="max-w-6xl mx-auto flex md:flex-row justify-around items-center gap-4">
          <div className="flex items-center">
            <Label className="text-lg font-semibold">Car Marketplace</Label>
          </div>
          <Header isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Welcome to Car Marketplace
          </h1>
          
          <div className="w-full max-w-md flex flex-col gap-6">
            <Link href="/createproduct" className="w-full">
              <Button 
                size="lg" 
                className="w-full md:w-auto px-8 py-4 text-lg transition-all hover:scale-105"
              >
                Create New Listing
              </Button>
            </Link>
            
            <Link href="/allcars" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-auto px-8 py-4 text-lg transition-all hover:scale-105"
              >
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}