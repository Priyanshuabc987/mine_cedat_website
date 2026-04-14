
"use client";

import { useFICEvent, useRegisterForEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function FICPage() {
  const { data: event, isLoading } = useFICEvent();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegisterForEvent();
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    if (!isAuthenticated) return;
    try {
      await registerMutation.mutateAsync({ eventId: event?.id || '', metadata: {} });
      setIsRegistered(true);
      toast({ title: "Registered for FIC" });
    } catch (e) {
      toast({ title: "Registration failed", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 animate-spin text-white" /></div>;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="text-zinc-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto space-y-12">
          <div className="aspect-square rounded-3xl overflow-hidden border border-zinc-800">
            <img src={event?.featured_image_url || ''} alt="FIC" className="w-full h-full object-cover" />
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter italic">{event?.title}</h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">{event?.description}</p>
            
            <div className="pt-8">
              {isRegistered ? (
                <Button disabled className="rounded-full bg-zinc-800 text-zinc-400 h-16 px-12">
                  <CheckCircle className="w-5 h-5 mr-2" /> Registered
                </Button>
              ) : (
                <Button onClick={handleRegister} className="rounded-full bg-accent hover:bg-accent/90 text-white h-16 px-12 font-black text-lg">
                  Confirm Participation
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
