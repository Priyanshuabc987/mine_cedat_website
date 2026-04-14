
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useFICEvent, useRegisterForEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { registrationsAPI } from "@/lib/api";
import { getImageUrl } from "@/lib/images";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function FICPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: event, isLoading, error } = useFICEvent();
  const { user, isAuthenticated } = useAuth();
  const registerMutation = useRegisterForEvent();
  const [showFICForm, setShowFICForm] = useState(false);
  const [networkingInterest, setNetworkingInterest] = useState<"" | "yes" | "no">("");
  const [pitchInterest, setPitchInterest] = useState<"" | "yes" | "no">("");

  const { data: registrationsData } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const response = await registrationsAPI.getMyRegistrations();
      return await response.json();
    },
    enabled: isAuthenticated && !!user && !!event,
  });

  const isRegistered = Boolean(
    event && registrationsData?.items?.some((reg: { event_id: string }) => reg.event_id === event.id)
  );

  const handleConfirmParticipation = () => {
    if (!event) return;
    if (!isAuthenticated) {
      sessionStorage.setItem('intended_event', event.id);
      sessionStorage.setItem('intended_redirect', '/fic');
      router.push('/register');
      return;
    }
    if (isRegistered) return;
    setShowFICForm(true);
  };

  const handleSubmitFICForm = async () => {
    if (!event || !isAuthenticated || isRegistered) return;
    if (!networkingInterest || !pitchInterest) {
      toast({
        title: "Please answer all questions",
        description: "Select Yes or No for both networking and pitching questions.",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await registerMutation.mutateAsync({
        eventId: event.id,
        metadata: {
          fic_networking_interest: networkingInterest === "yes",
          fic_pitch_interest: pitchInterest === "yes",
        },
      });
      toast({ title: "Registration successful", description: "You're registered for FIC." });
      setShowFICForm(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center pt-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
      </div>
    );
  }

  const featuredImage = event?.featured_image_url ? getImageUrl(event.featured_image_url) : undefined;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-zinc-400 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="aspect-square rounded-3xl overflow-hidden border border-zinc-800">
              <img src={featuredImage || ''} alt="FIC" className="w-full h-full object-cover" />
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
                  <Button onClick={handleConfirmParticipation} className="rounded-full bg-accent hover:bg-accent/90 text-white h-16 px-12 font-black text-lg">
                    Confirm Participation
                  </Button>
                )}
              </div>

              {showFICForm && (
                <Card className="max-w-xl mx-auto bg-zinc-900 border-zinc-800 text-white text-left mt-12">
                  <CardHeader><CardTitle>Registration Details</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Interested for networking? *</Label>
                      <Select value={networkingInterest} onValueChange={(val: any) => setNetworkingInterest(val)}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Want to pitch your startup? *</Label>
                      <Select value={pitchInterest} onValueChange={(val: any) => setPitchInterest(val)}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <Button variant="ghost" onClick={() => setShowFICForm(false)}>Cancel</Button>
                      <Button onClick={handleSubmitFICForm} className="bg-accent text-white">Submit Registration</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
