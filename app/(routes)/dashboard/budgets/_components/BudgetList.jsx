"use client"
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Expenses, budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import BudgetItem from './BudgetItem';

const BudgetList = () => {
  // Save in useState
  const [budgetList, setBudgetList] = useState([]);
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
    console.log(result);
  };

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget refreshData={() => getBudgetList()} />
        {Array.isArray(budgetList) && budgetList.map((budget, index) => (
          <BudgetItem key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
};

export default BudgetList;
