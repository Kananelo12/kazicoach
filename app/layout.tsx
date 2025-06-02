import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import ToggleButton from "@/components/ToggleButton";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaziCoach",
  description: "A platform for personalized coaching and mentorship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaSans.className} antialiased`}>
        <ThemeProvider attribute="class">
          {children}

          <ToggleButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
