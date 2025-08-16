"use client";
import React, { useState } from "react";
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
import EmojiPicker from "emoji-picker-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { db } from "../../../../utils/dbConfig";
import { Budgets } from "../../../../utils/schema";
import { Sparkles, TrendingUp, Target } from "lucide-react";

export default function CreateBudget({ refreshData, parentOptions }) {
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [parentId, setParentId] = useState("");

  const { user } = useUser();

  const onCreateBudget = async () => {
    if (!name || !amount) {
      toast.error("Please enter budget name and amount");
      return;
    }

    try {
      const result = await db
        .insert(Budgets)
        .values({
          name: name,
          amount: Number(amount),
          createdBy: user?.primaryEmailAddress?.emailAddress || "Anonymous",
          icon: emojiIcon,
          parentId: parentId || null, // NEW: Save parentId if selected
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        refreshData();
        toast.success("New Budget Created Successfully");
        setName("");
        setAmount("");
        setParentId("");
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
          <div
            className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 p-6 lg:p-8 w-full
           rounded-2xl items-center flex flex-col 
           border-2 border-dashed border-violet-300 cursor-pointer
            hover:bg-gradient-to-br hover:from-violet-100 hover:to-purple-100 hover:border-violet-500 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 h-[180px] justify-center overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-violet-200/30 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-300/20 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center mb-4 shadow-2xl group-hover:rotate-12 transition-all duration-300">
              <h2 className="text-3xl font-bold">+</h2>
              <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" size={16} />
            </div>
            
            <h2 className="text-gray-800 font-bold text-lg text-center relative z-10">
              Create New Budget
            </h2>
            <p className="text-gray-600 text-sm mt-2 text-center relative z-10 font-medium">
              Start tracking your expenses
            </p>
            
            <div className="flex items-center gap-1 mt-3 text-violet-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Target size={14} />
              <span className="text-xs font-medium">Set your financial goals</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md lg:max-w-lg bg-gradient-to-br from-white to-violet-50 border-violet-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="text-violet-500" size={24} />
              Create New Budget
            </DialogTitle>
            <DialogDescription>
              <div className="mt-6 space-y-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Choose an icon for your budget</p>
                  <Button
                    variant="outline"
                    className="text-3xl h-16 w-16 rounded-2xl border-2 border-violet-200 hover:border-violet-400 hover:bg-violet-50 transition-all duration-300 hover:scale-110"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    {emojiIcon}
                  </Button>
                </div>
                
                {openEmojiPicker && (
                  <div className="absolute right-0 top-0 z-50 rounded-2xl overflow-hidden shadow-2xl">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h2 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Budget Name</h2>
                  <Input
                    placeholder="Enter Budget Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 border-violet-200 focus:border-violet-400 focus:ring-violet-400 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Budget Amount</h2>
                  <Input
                    type="number"
                    placeholder="Enter Budget Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 border-violet-200 focus:border-violet-400 focus:ring-violet-400 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Parent Budget</h2>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="
                      w-full 
                      border border-violet-200 
                      p-3 
                      rounded-xl 
                      text-sm lg:text-base 
                      focus:outline-none 
                      focus:ring-2 
                      focus:ring-violet-400 
                      focus:border-violet-400
                      transition-all 
                      duration-200
                      bg-white
                      h-12
                    "
                  >
                    <option value="">Make this a Parent Budget</option>
                    {parentOptions.map((parent) => (
                      <option
                        key={parent.id}
                        value={parent.id}
                        className="text-gray-700"
                      >
                        Child of {parent.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Preview Section */}
                {(name || amount) && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl border border-violet-200">
                    <h3 className="text-sm font-bold text-violet-800 mb-3 flex items-center gap-2">
                      <Target size={16} />
                      Budget Preview
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl bg-white p-2 rounded-lg shadow-sm">
                        {emojiIcon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{name || "Budget Name"}</p>
                        <p className="text-violet-600 font-bold">${amount || "0"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={onCreateBudget}
                className="w-full mt-6 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus size={18} className="mr-2" />
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
