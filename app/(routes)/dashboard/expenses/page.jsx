"use client";
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Expenses, budgets } from '@/utils/schema';
import ExpenseListTable from '../expensespage/_components/ExpenseListTable';


const ExpensesPage = ({ params }) => {
  // Save in useState
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
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
    <div className="p-10">
      <h2 className="font-bold text-3xl mb-3">My Expenses</h2>
      <div className="mt-4">
        <h2 className='font-bold text-lg mt-5'>Latest Expenses</h2>
        <ExpenseListTable expenseList={expensesList} refreshData={() => getBudgetList()} />
      </div>
    </div>
  );
};

export default ExpensesPage;
