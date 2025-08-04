"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Button } from '../../../../components/ui/button';
import { Input } from "../../../../@/components/ui/input";
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { db } from '../../../../utils/dbConfig';
import { Budgets } from '../../../../utils/schema';

export default function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState('😊');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const { user } = useUser();

  const onCreateBudget = async () => {
    if (!name || !amount) {
      toast.error("Please enter budget name and amount");
      return;
    }

    try {
      const result = await db.insert(Budgets).values({
        name: name,
        amount: Number(amount), // ✅ Ensure amount is a number
        createdBy: user?.primaryEmailAddress?.emailAddress || "Anonymous",
        icon: emojiIcon
      }).returning({ insertedId: Budgets.id });

      if (result) {
        refreshData()
        toast.success("New Budget Created Successfully");
        setName('');
        setAmount('');
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-8 w-full
           rounded-xl items-center flex flex-col 
           border-2 border-dashed border-blue-300 cursor-pointer
            hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 h-[170px] justify-center'>
            <div className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-3 shadow-lg'>
              <h2 className='text-2xl font-bold'>+</h2>
            </div>
            <h2 className='text-gray-700 font-semibold text-center'>Create New Budget</h2>
            <p className='text-gray-500 text-sm mt-1 text-center'>Start tracking your expenses</p>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className='mt-5'>
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className='absolute right-0 top-0 z-50'>
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Budget Name</h2>
                  <Input
                    placeholder="Enter Budget Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="Enter Budget Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={onCreateBudget}
                className="w-full mt-5"
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
