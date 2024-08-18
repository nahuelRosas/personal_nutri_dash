import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

export default function Providers() {
  return (
    <FlagsmithProvider
      options={{
        environmentID:
          (import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID as string) ?? "",
      }}
      flagsmith={flagsmith}
    >
      <ChakraProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </AuthProvider>
      </ChakraProvider>
    </FlagsmithProvider>
  );
}
