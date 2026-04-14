
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md rounded-3xl border shadow-sm">
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="rounded-xl h-12" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-primary hover:underline">Forgot Password?</Link>
            </div>
            <Input id="password" type="password" className="rounded-xl h-12" />
          </div>
          <Button className="w-full h-12 rounded-full font-bold bg-primary hover:bg-primary/90">
            Sign In
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
