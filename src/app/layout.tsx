import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Comfortaa, Philosopher } from "next/font/google";

import AppProviders from "@/components/providers/AppProviders";
import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/components/providers/Auth-Provider";

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

function resolveInitialTheme(themeCookie?: string) {
  return themeCookie === "dark" ? "dark" : "light";
}

function getThemeInitScript() {
  return `
    (() => {
      const themeCookie = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('theme='))
        ?.split('=')[1];

      const isDark =
        themeCookie === 'dark' ||
        (!themeCookie && window.matchMedia('(prefers-color-scheme: dark)').matches);

      const root = document.documentElement;
      root.classList.toggle('dark', isDark);
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      root.style.colorScheme = isDark ? 'dark' : 'light';
    })();
  `;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme = resolveInitialTheme(themeCookie);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={initialTheme === "dark" ? "dark" : undefined}
      data-theme={initialTheme}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body
        className={`${comfortaa.variable} ${philosopher.variable} antialiased`}
      >
        <AuthProvider>
          <AppProviders>
            <Navbar user={null} />
            <div className="flex min-h-screen w-full">
              <Sidebar />
              <main className="pt-16 w-full">{children}</main>
            </div>
          </AppProviders>
        </AuthProvider>
      </body>
    </html>
  );
}