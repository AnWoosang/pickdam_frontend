"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 전역 queryClient export
export let queryClient: QueryClient;

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () => {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            retry: 1,
          },
        },
      });
      return queryClient;
    }
  );

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}