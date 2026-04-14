import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { generateSEO, seoConfigs } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      {generateSEO(seoConfigs.notFound)}
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-display font-bold">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-muted-foreground mb-6">
              The page you're looking for doesn't exist.
            </p>

            <Link href="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
