"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '../ui/button'

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className='p-4 md:p-6 shadow-md bg-white'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <Link href="#" className='text-xl font-bold mb-4 md:mb-0'>
          <div className="flex flex-row gap-4 text-center justify-center">
          <img src={'./logo.png'} width={50} height={50} />
          <h1 className="text-center self-center flex justify-center font-serif">Feed Me</h1>
          </div>
          </Link>
        {session ? <div><span className='mr-4 text-bold text-lg font-serif'> Welcome,{user?.username || user?.email}</span><Button onClick={() => signOut()} className='w-full md:w-auto'>Logout</Button></div>
          : (<Link href='/sign-in'>
            <Button onClick={() => signOut()} className='w-full md:w-auto'>Login</Button>
          </Link>)}
      </div>
    </nav>
  )
}

export default Navbar
