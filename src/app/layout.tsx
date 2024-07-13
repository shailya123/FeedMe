import Navbar from '@/components/self-ui/Navbar';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '../context/AuthProvider';
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';

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
            {/* <Footer /> */}
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
