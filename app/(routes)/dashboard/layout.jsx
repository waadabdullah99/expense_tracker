"use client"
import React, { useEffect } from 'react';
import SideNav from './_components/SideNav';
import DashboardHeader from './_components/DashboardHeader';
import { db } from '@/utils/dbConfig';
import { budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
const DashboardLayout = ({ children }) => {

  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    user && checkUserBudgets();
  }, [user])

  //if the user did not create any budget or not
  const checkUserBudgets = async () => {
    const result = await db.select()
      .from(budgets)
      .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    // console.log(result);
    //if the user did not create any budget direct it to budget page so user can create a new budget
    if (result?.length == 0) {
      router.replace('/dashboard/budgets')
    }
  }
  return (
    <div>
      <div className='fixed md:w-64 hidden md:block'>
        <SideNav />
      </div>
      <div className='md:ml-64'>
        <DashboardHeader />
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
