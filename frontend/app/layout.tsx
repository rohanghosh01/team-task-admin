import "./globals.css";
import '@mdxeditor/editor/style.css'
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import LoadingScreen from "@/components/LoadingScreen";
import MessageToast from "@/components/message-toast";
import { AppProviders } from "./AppProviders";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClientWrapper } from "./QueryClientWrapper";
export const metadata: Metadata = {
  title: "TeamTasker - Collaborative Team Management",
  description: "Streamline your team collaboration with TeamTasker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientWrapper>
          <AppProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <SonnerToaster richColors position="top-right" closeButton />
              <LoadingScreen />
              <MessageToast />
              {children}
            </ThemeProvider>
          </AppProviders>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
