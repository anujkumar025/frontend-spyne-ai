"use client";

import { useState } from 'react';
import axios from 'axios';
import { API_URL, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import CarSVG from './svgs/car';
import Link from 'next/link';

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [passwordFirst, setPasswordFirst] = useState('');
  const [passwordSecond, setPasswordSecond] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    
    try {
      if(passwordFirst !== passwordSecond){
          alert('Passwords do not match');
          setIsLoading(false);
          return;
      }
      // console.log(username, passwordFirst);
      await axios.post(`${API_URL}signup`, {
        username,
        password: passwordFirst
      },{headers: {
        'Content-Type': 'application/json' // Explicitly set header
      }});
        router.push('/signin')
  
    } catch (err) {
      console.log(err);
      alert("User already exist");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="CarEnthusiast"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password1" 
                  type="password" 
                  required
                  value={passwordFirst}
                  onChange={(e) => setPasswordFirst(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input 
                  id="password2" 
                  type="password" 
                  required
                  value={passwordSecond}
                  onChange={(e) => setPasswordSecond(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <CarSVG/>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}