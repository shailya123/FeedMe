"use client";
import { Moon, Sun } from "lucide-react";
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from "next-themes";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme()
  const user: User = session?.user as User;

  return (
    <nav className='p-4 md:p-6 shadow-md border bg-background'>
      <div className='mx-2 flex flex-col md:flex-row justify-between items-center'>
        <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>
          <div className="flex flex-row gap-4 text-center justify-center">
            <h1 className="text-center self-center flex justify-center font-serif text-3xl">Feed Me</h1>
          </div>
        </Link>
        <div className="flex gap-4 justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {status === "authenticated" ? (
            <div>
              <span className='mr-4 font-bold text-lg font-serif'> Welcome, {user?.username || user?.name}</span>
              <Button onClick={() => signOut()} className='w-full md:w-auto'>Logout</Button>
            </div>
          ) : ((pathname === '/sign-in' || pathname === '/sign-up') ? (
            // <Link href='/sign-up' passHref>
            <Button className='w-full md:w-auto' onClick={() => router.push('/')}>Move to home {'->'}</Button>
            // </Link>
          ) : (<Button className='w-full md:w-auto' onClick={() => router.push('/sign-in')}>login</Button>)
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
