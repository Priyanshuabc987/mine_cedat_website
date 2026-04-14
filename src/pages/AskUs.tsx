import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSEO, seoConfigs } from "@/lib/seo";
import { ExternalLink } from "lucide-react";

const FORM_APP_URL = "https://play.google.com/store/apps/details?id=com.heartfull.forms";

export default function AskUs() {
  return (
    <>
      {generateSEO(seoConfigs.askUs)}
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4">
                Ask Us
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                For any requirement or help from the community, please fill this form.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl">Fill the Form</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground text-center max-w-prose">
                  This form opens in the Heartfull Forms app on Android.
                </p>
                <Button asChild className="rounded-full min-h-[44px] px-6">
                  <a href={FORM_APP_URL} target="_blank" rel="noopener noreferrer">
                    Open on Google Play <ExternalLink />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

