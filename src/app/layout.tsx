import type { Metadata } from "next";
import { Comfortaa, Philosopher } from "next/font/google";

import AppProviders from "@/components/providers/AppProviders";
import Navbar from "@/components/shared/navbar/Navbar";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const comfortaa = Comfortaa({
  variable: "--font-main",
  subsets: ["latin"],
});

const philosopher = Philosopher({
  variable: "--font-header",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Palm Mirage Dashboard",
  description: "Palm Mirage Hotel administration dashboard.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${comfortaa.variable} ${philosopher.variable} antialiased`}>
        <AppProviders>
          <Navbar user={null} />
          <main className="min-h-screen w-full pt-16">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
