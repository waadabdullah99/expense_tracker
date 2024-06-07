import { UserButton, useUser } from '@clerk/nextjs'
import React from 'react'

const DashboardHeader = () => {
  const {user} = useUser();
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
      <div>
      <h2 className='text-2xl'>Hi, {user?.firstName} 👋🏻</h2>
      </div>
    <div>
        <UserButton />
    </div>
    </div>
  )
}
export default DashboardHeader
