"use client"
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

const CreateBudget = ({refreshData}) => {
    // set emoji
    const [emojiIcon, setEmojiIcon] = useState('😳');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    // set name
    const [name, setName] = useState();
    // set amount
    const [amount, setAmount] = useState();
    // store users input in the database
    const { user } = useUser();
    const onCreateBudget = async () => {
        const result = await db.insert(budgets).values({
            name: name,
            amount: amount,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            icon: emojiIcon
        }).returning({ inseredId: budgets.id })
        // successfuly inserted data into DB and creating new budget without refreshing the page
        if (result) {
            refreshData();
            toast.success('Successfully created a new budget!')
        }
    }


    return (
        <div >
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:bg-blue-100'>
                        <h2 className='text-3xl'>+</h2>
                        <h2>Create a new budget</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new budget</DialogTitle>
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
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 1000 SR"
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
                                onClick={() => onCreateBudget()}
                                className='mt-5 w-full'>Create Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CreateBudget
