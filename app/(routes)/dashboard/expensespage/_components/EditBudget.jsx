"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

const EditBudget = ({ budgetInfo ,refreshData}) => {
    // set emoji
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    // set name
    const [name, setName] = useState(budgetInfo?.name);
    // set amount
    const [amount, setAmount] = useState(budgetInfo?.amount);
    // store users input in the database
    const { user } = useUser();

    const onUpdateBudget = async() => {
        const result = await db.update(budgets).set({
            name:name,
            amount:amount,
            icon:emojiIcon
        }).where(eq(budgets.id,budgetInfo.id)).returning();
        if(result){
            refreshData();
            toast('Successfully updated the budget!')
        }
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex gap-2'><PenBox /> Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update your budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant="outline" className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                                >{emojiIcon}</Button>
                                <div className='mt-2 absolute z-20'>
                                    <EmojiPicker open={openEmojiPicker}
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji)
                                            setOpenEmojiPicker(false)
                                        }} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <Input placeholder="e.g. Laptop"
                                        defaultValue={budgetInfo?.name}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 1000 SR"
                                        defaultValue={budgetInfo?.amount}
                                        onChange={(e) => setAmount(e.target.value)} />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                //button wont be clicked untill the user inserts name and amount
                                disabled={!(name && amount)}
                                // store users inputs
                                onClick={() => onUpdateBudget()}
                                className='mt-5 w-full'>Update Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default EditBudget
