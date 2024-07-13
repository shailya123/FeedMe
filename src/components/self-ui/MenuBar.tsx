"use client";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger
} from "@/components/ui/menubar";
import { useAuth } from "@/context/UserContext";
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
type Props = {
    icon: ReactNode,
    user?: User | null
}
const MenuBar = ({ icon, user }: Props) => {
    const { setTheme } = useTheme()
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        signOut();
    }
    return (
        <div>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>{icon}</MenubarTrigger>
                    <MenubarContent>
                        <Link href={`/${user?.name || user?.username}/profile`}>
                            <div className="flex gap-2 items-center capitalize p-1 cursor-pointer" >
                                <h1>Your Profile</h1>
                            </div>
                        </Link>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger>
                                <span className="cursor-pointer">Theme</span>
                            </MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={() => setTheme("light")} className="cursor-pointer">Light</MenubarItem>
                                <MenubarItem onClick={() => setTheme("dark")} className="cursor-pointer">Dark</MenubarItem>
                                <MenubarItem onClick={() => setTheme("system")} className="cursor-pointer">System</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarItem onClick={handleLogout} className='w-full md:w-auto cursor-pointer'>Logout</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

        </div >
    )
}

export default MenuBar
