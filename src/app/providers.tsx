
"use client";

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FirebaseClientProvider } from "@/firebase/client-provider";

// This is the single source of truth for the QueryClient.
// By creating it inside the Providers component with useState, we guarantee
// that the same client instance is used for all children, solving the caching issue.
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Default stale time can be set here to avoid excessive refetching.
        staleTime: 1000 * 60, // 1 minute
      },
    },
  }));

  return (
    <FirebaseClientProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </FirebaseClientProvider>
  );
}
