
import { Button } from "@/components/ui/button";
import { MessageCircle, ExternalLink } from "lucide-react";

export default function AskUsPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-2xl w-full bg-white p-12 rounded-3xl shadow-sm border text-center space-y-8">
        <div className="bg-background w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-headline">Have a Question?</h1>
          <p className="text-muted-foreground text-lg">
            We're here to help you navigate the ecosystem. Click the button below to submit your inquiry via our official form.
          </p>
        </div>
        <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold bg-primary hover:bg-primary/90 group" asChild>
          <a href="https://example.com/inquiry-form" target="_blank" rel="noopener noreferrer">
            Contact Us Now <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </Button>
      </div>
    </div>
  );
}
