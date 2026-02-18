"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function Header() {
    const { user } = useUser()
    return (
        <div className='flex items-center justify-between p-4 px-10 shadow-md border-b'>
            <div className='flex items-center gap-3'>
                <Image src={"/globe.svg"} alt="logo" width={40} height={40} />
                <h2 className='font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Vid Course
                </h2>
            </div>

            <ul className='hidden md:flex gap-8 items-center font-medium'>
                <li className='hover:text-primary cursor-pointer transition-all'>Home</li>
                <li className='hover:text-primary cursor-pointer transition-all'>Pricing</li>
            </ul>

            <div className='flex items-center gap-4'>
                {user ? (
                    <div className='flex items-center gap-4'>
                        <Button variant="ghost" className="hidden sm:inline-flex">Dashboard</Button>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                ) : (
                    <SignInButton mode='modal'>
                        <Button className='rounded-full'>Get Started</Button>
                    </SignInButton>
                )}
            </div>
        </div>
    )
}

export default Header