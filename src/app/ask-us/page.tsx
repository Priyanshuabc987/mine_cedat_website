
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ExternalLink } from "lucide-react";

export default function AskUsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight">Ask <span className="text-accent italic">Us</span></h1>
            <p className="text-lg text-muted-foreground">For any requirement or help from the community, please fill this form.</p>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 sm:p-12">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto text-accent">
                <MessageCircle className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl font-black">Submit Inquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-muted-foreground">
                We're here to help you navigate the ecosystem. Click the button below to submit your inquiry via our official form.
              </p>
              <Button size="lg" className="w-full rounded-full h-16 font-black text-lg bg-accent hover:bg-accent/90 group">
                Open Official Form <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
