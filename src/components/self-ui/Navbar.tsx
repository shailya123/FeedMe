"use client";
import { Menu, Moon, Sun } from "lucide-react";
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
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
import { useAuth } from "@/context/UserContext";
import { useEffect } from "react";
import MenuBar from "./MenuBar";
import ProfileNavbar from "./ProfileNavbar";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme()
  const { user, login, logout } = useAuth();
  useEffect(() => {
    if (session && session.user && !user) {
      const userFromSession: User = session.user as User;
      login(userFromSession);
    }
  }, [session, user, login]);
  const pathArray = [, '/reset-password', '/forgot-password']
  return (
    <>
      {pathname.split('/')[3] === 'feedback' || pathArray.includes(pathname)|| pathname.includes('/verify') ? <ProfileNavbar /> :
        <nav className='p-4 md:p-6 shadow-md border bg-foreground'>
          <div className='mx-2 flex flex-row sm:flex-row justify-between items-center'>
            <Link href="/dashboard" className='text-xl font-bold mb-4 md:mb-0'>
              <div className="flex flex-row gap-4 text-center justify-center">
                <h1 className="text-center flex justify-center font-serif text-3xl text-background">Feed Me</h1>
              </div>
            </Link>
            <div className="flex gap-4 justify-center items-center">
              {!user?.username && <DropdownMenu>
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
              </DropdownMenu>}
              {user?.username ? (
                <div>
                  <MenuBar icon={<Menu />} user={user} />
                </div>
              ) : ((pathname === '/sign-in' || pathname === '/sign-up') ? (
                <Button className='w-full md:w-auto text-background' onClick={() => router.push('/')}>Move to home {'->'}</Button>
              ) : (<Button className='w-full md:w-auto text-background' onClick={() => router.push('/sign-in')}>login</Button>)
              )}
            </div>
          </div>
        </nav>
      }
    </>
  );
};

export default Navbar;
