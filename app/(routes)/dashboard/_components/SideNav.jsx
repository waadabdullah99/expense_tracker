'use client';
import { UserButton, useUser } from '@clerk/nextjs'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, icons } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const SideNav = () => {
  const { user } = useUser();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuList = [
    {
      id: 1,
      name: 'Dashboard',
      icon: LayoutGrid,
      path: '/dashboard'
    },
    {
      id: 2,
      name: 'Budgets',
      icon: PiggyBank,
      path: '/dashboard/budgets'
    },
    {
      id: 3,
      name: 'Expenses',
      icon: ReceiptText,
      path: '/dashboard/expenses'
    },
    {
      id: 4,
      name: 'Contact',
      icon: ShieldCheck,
      path: '/dashboard/contactUs'
    }
  ]

  useEffect(() => {
    console.log(path)
  }, [path])

  return (
    <div className='flex'>
      <button className='lg:hidden p-2 fixed top-4 left-4 z-50' onClick={() => setIsOpen(!isOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <div className={`h-screen p-5 border shadow-sm bg-white fixed lg:relative z-40 transform lg:transform-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Link href="/dashboard">
          <Image
            src={'/tracker.png'}
            alt='logo'
            width={160}
            height={100}
            style={{ cursor: 'pointer' }}
          />
        </Link>
        <div className='mt-5'>
          {menuList.map((menu, index) => (
            <Link key={menu.id} href={menu.path}>
              <h2 className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${path === menu.path && 'text-primary bg-blue-200'}`}>
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
        {/* <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
          <UserButton />
        </div> */}
      </div>
    </div>
  )
}

export default SideNav
