import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from './providers/ThemeProvider';
import Navbar from '@/components/self-ui/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Feed Me',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body className={`${inter.className} flex flex-col min-h-screen justify-between flex-1`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Toaster />
            <footer className="text-center font-bold p-5 md:p-6 bg-background border shadow-md">
              © 2024 FeedMe. All rights reserved.
            </footer>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
