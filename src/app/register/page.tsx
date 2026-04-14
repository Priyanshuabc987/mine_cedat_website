
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md rounded-3xl border shadow-sm">
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Create an Account</CardTitle>
          <CardDescription>Join our ecosystem and start your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" className="rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" className="rounded-xl h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="rounded-xl h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="rounded-xl h-12" />
          </div>
          <Button className="w-full h-12 rounded-full font-bold bg-primary hover:bg-primary/90">
            Create Account
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
