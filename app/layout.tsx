import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090E] text-[#F1F0EE] antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
