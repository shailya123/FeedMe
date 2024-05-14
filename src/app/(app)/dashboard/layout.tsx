import Navbar from "@/components/self-ui/Navbar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '../../../app/globals.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FeedMe",
    description: "Random Feedback Messaging Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                {children}
                <Toaster />
            </body>

        </html>
    );
}
