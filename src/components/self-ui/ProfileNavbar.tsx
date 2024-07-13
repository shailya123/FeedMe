"use client";
import Link from 'next/link';


const ProfileNavbar = () => {
    return (
        <nav className='p-4 md:p-6 shadow-md border bg-foreground'>
            <div className='mx-2 flex flex-row sm:flex-row justify-between items-center'>
                <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>
                    <div className="flex flex-row gap-4 text-center justify-center">
                        <h1 className="text-center flex justify-center font-serif text-3xl text-background">Feed Me</h1>
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default ProfileNavbar;
