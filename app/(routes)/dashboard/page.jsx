"use client"
import { useUser, UserButton } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardsInfo from './_components/CardsInfo';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Expenses, budgets } from '@/utils/schema';
import BarcharDashboard from './_components/BarcharDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expensespage/_components/ExpenseListTable';

const page = () => {
  // Save in useState
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList,setExpensesList] = useState([]);
  // Get user info
  const { user } = useUser();
  // Calling getBudgetList function
  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    const result = await db.select({
      // Joining two tables from the db (budgets and expenses) into a single table
      ...getTableColumns(budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),  // Sum of total spend expenses
      totalItems: sql`count(${Expenses.id})`.mapWith(Number),
    }).from(budgets)
      .leftJoin(Expenses, eq(budgets.id, Expenses.budgetsId))
      .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(budgets.id).orderBy(desc(budgets.id));
    setBudgetList(result);
    getAllExpenses();
    console.log(result);
  };

  // display all expenses list that belongs to user in dashboard
  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    }).from(budgets).rightJoin(Expenses, eq(budgets.id, Expenses.budgetsId))
      .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));
      setExpensesList(result);
    console.log(result);

  }
  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold mb-2'>My Dashboard</h2>
      <p className='text-gray-500'>Here's what happening with your money, Let's manage your expenses</p>
      <CardsInfo budgetList={budgetList} />
      {/* bar char Dashboard */}
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarcharDashboard budgetList={budgetList} />
          <h2 className='font-bold text-lg mt-5'>Latest Expenses</h2>
          <ExpenseListTable expenseList={expensesList} refreshData={()=>getBudgetList()}/>
        </div>
        <div className='grid gap-3'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>

      </div>

    </div>
  )
}

export default page
