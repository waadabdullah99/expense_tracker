"use client";
import { db } from '@/utils/dbConfig';
import { Expenses, budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

const ExpensesPage = ({ params }) => {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expenseList, setExpenseList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            getBudgetList();
        }
    }, [user]);

    const getExpensesList = async () => {
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetsId, params.id))
            .orderBy(desc(Expenses.id));
        setExpenseList(result);
        console.log(result);
    };

    const getBudgetList = async () => {
        try {
            const budgetId = parseInt(params.id);
            if (isNaN(budgetId)) {
                throw new Error('Invalid budget ID');
            }
            const result = await db.select({
                ...getTableColumns(budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItems: sql`count(${Expenses.id})`.mapWith(Number),
            }).from(budgets)
                .leftJoin(Expenses, eq(budgets.id, Expenses.budgetsId))
                .where(eq(budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .where(eq(budgets.id, budgetId))
                .groupBy(budgets.id);
            setBudgetInfo(result[0]);
        } catch (err) {
            setError('Failed to fetch budget information: ' + err.message);
        } finally {
            setLoading(false);
        }
        getExpensesList();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // delete budget from db
    const deleteBudget = async () => {
        // Delete expenses first to avoid foreign key constraint violation
        const deleteExpenseResult = await db.delete(Expenses)
            .where(eq(Expenses.budgetsId, params.id))
            .returning();

        if (deleteExpenseResult) {
            await db.delete(budgets)
                .where(eq(budgets.id, params.id))
                .returning();
        }
        toast.success('Successfully deleted the budget!');
        router.replace('/dashboard/budgets');
    };

    return (
        <div className='p-10'>
            <div className='flex items-center gap-2 mb-3'>
                <Button size="icon" onClick={() => router.replace('/dashboard/budgets')}>
                    <ArrowLeft className='text-lg' />
                </Button>
                <h2 className='font-bold text-3xl'>
                    My Expenses
                </h2>
                <div className='flex gap-2 items-center ml-auto'>
                    <EditBudget budgetInfo={budgetInfo} refreshData={() => getBudgetList()} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className='flex gap-2' variant='destructive'><Trash /> Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this budget?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your current budget along with expenses and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div>No budget information available.</div>
                )}
                <AddExpense budgetsId={parseInt(params.id)} refreshData={() => getBudgetList()} />
            </div>
            <div className='mt-4'>
                <h2 className='font-bold text-lg'>Latest Expenses</h2>
                <ExpenseListTable expenseList={expenseList} refreshData={() => getBudgetList()} />
            </div>
        </div>
    );
};

export default ExpensesPage;
