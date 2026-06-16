import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Prept — AI Interview Coach",
  description:
    "Practice smarter. Interview better. Prept coaches you through mock interviews with real-time voice input and instant AI feedback.",
  metadataBase: new URL("https://prept.app"),
  openGraph: {
    title: "Prept — AI Interview Coach",
    description:
      "Speak your answer, get scored in seconds. Real AI coaching on every interview answer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Prevent flash: apply saved theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('prept-theme')||'dark';document.documentElement.className=t;})()`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
