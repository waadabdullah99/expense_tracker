"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'sonner';

const AddExpense = ({ budgetsId,refreshData }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const {user} = useUser();

    const addNewExpense = async () => {
        try {
            const parsedAmount = parseFloat(amount);
            const parsedBudgetId = parseInt(budgetsId);

            if (isNaN(parsedAmount) || isNaN(parsedBudgetId)) {
                throw new Error('Invalid amount or budget ID');
            }

            const result = await db.insert(Expenses).values({
                name: name,
                amount: parsedAmount,
                budgetsId: parsedBudgetId,
                createdAt: moment().format('DD/MM/yyy')
            }).returning({ insertedId: Expenses.id });

            // reset inputs
            setAmount('');
            setName('');
            console.log(result);

            if (result) {
                toast.success('Successfully created a new expense!');
                refreshData();
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error('Failed to create a new expense: ' + error.message);
        }
    };

    return (
        <div>
            <div className='border p-5 rounded-lg'>
                <h2 className='font-bold text-lg'>Add a new Expense</h2>
                <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Expense Name</h2>
                    <Input
                        placeholder="e.g. Bedroom Decor"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                    <Input
                        type="number"
                        placeholder="e.g. 1000 SR"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <Button
                    disabled={!(name && amount)}
                    onClick={addNewExpense}
                    className='mt-3 w-full'
                >
                    Add New Expense
                </Button>
            </div>
        </div>
    );
};

export default AddExpense;