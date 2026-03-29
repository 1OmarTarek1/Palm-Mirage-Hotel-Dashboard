import type { Metadata } from 'next';
import { Comfortaa, Philosopher } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/shared/navbar/Navbar';
import Sidebar from '@/components/shared/sidebar/Sidebar';

const comfortaa = Comfortaa({
  variable: '--font-main',
  subsets: ['latin'],
});

const philosopher = Philosopher({
  variable: '--font-header',
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Palm Mirage Dashboard',
  description: 'Palm Mirage Hotel administration dashboard.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${comfortaa.variable} ${philosopher.variable} antialiased`}
      >
        <Navbar user={null} />
        <div className="flex min-h-screen w-full">
        <Sidebar/>
        <main className="pt-16">{children}</main>
        </div>
      </body>
    </html>
  );
}
