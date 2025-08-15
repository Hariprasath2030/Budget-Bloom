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
import { Sparkles, Target, TrendingUp, Zap, Star, Rocket } from "lucide-react";

export default function CreateBudget({ refreshData, parentOptions }) {
  const [emojiIcon, setEmojiIcon] = useState("💰");
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
          parentId: parentId || null,
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        refreshData();
        toast.success("🎉 New Budget Created Successfully!");
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
          <div className="group relative overflow-hidden cursor-pointer">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl blur-2xl scale-110"></div>
            
            <div className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-100 p-6 sm:p-8 w-full rounded-3xl items-center flex flex-col border-3 border-dashed border-cyan-300 hover:border-blue-500 hover:shadow-2xl transition-all duration-700 transform hover:scale-105 h-[180px] sm:h-[200px] justify-center backdrop-blur-sm group-hover:border-solid">
              
              {/* Floating elements */}
              <div className="absolute top-3 left-3 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-70"></div>
              <div className="absolute top-5 right-5 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-70"></div>
              <div className="absolute bottom-4 left-5 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute bottom-6 right-3 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-70"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 shadow-2xl group-hover:shadow-cyan-500/50 group-hover:scale-110 transition-all duration-700 relative overflow-hidden">
                  {/* Rotating shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-spin"></div>
                  <Rocket className="text-3xl sm:text-4xl font-bold relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                </div>
                
                <h2 className="text-gray-700 font-bold text-center text-base sm:text-lg group-hover:text-blue-700 transition-colors duration-500 mb-2">
                  Create New Budget
                </h2>
                
                <p className="text-gray-500 text-sm sm:text-base text-center group-hover:text-blue-600 transition-colors duration-500 flex items-center gap-2 mb-3">
                  <Star size={14} className="animate-pulse" />
                  Launch your financial goals
                  <Zap size={14} className="animate-pulse" />
                </p>
                
                {/* Animated progress dots */}
                <div className="flex gap-2">
                  <div className="w-3 h-1 bg-rose-300 rounded-full group-hover:bg-rose-500 transition-all duration-300 animate-pulse"></div>
                  <div className="w-3 h-1 bg-orange-300 rounded-full group-hover:bg-orange-500 transition-all duration-300 animate-pulse delay-100"></div>
                  <div className="w-3 h-1 bg-amber-300 rounded-full group-hover:bg-amber-500 transition-all duration-300 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white via-rose-50/30 to-amber-50/30 border-rose-200 shadow-2xl backdrop-blur-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-3 justify-center">
              <Rocket className="text-rose-600 animate-bounce" size={28} />
              Create Your Budget
              <Sparkles className="text-amber-600 animate-pulse" size={28} />
            </DialogTitle>
            <DialogDescription>
              <div className="mt-8 space-y-8">
                {/* Icon Selection with enhanced design */}
                <div className="relative">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 rounded-2xl border-2 border-rose-200 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl">
                        <Target size={20} className="text-white" />
                      </div>
                      <span className="text-lg font-bold text-rose-700">Choose Your Icon:</span>
                    </div>
                    <Button
                      variant="outline"
                      className="text-4xl h-16 w-16 rounded-2xl border-2 border-rose-300 hover:border-orange-500 hover:bg-gradient-to-r hover:from-rose-100 hover:to-orange-100 transition-all duration-500 hover:scale-110 shadow-xl hover:shadow-rose-200 relative overflow-hidden"
                      onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-200/20 to-orange-200/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">{emojiIcon}</span>
                    </Button>
                  </div>
                  
                  {openEmojiPicker && (
                    <div className="absolute right-0 top-0 z-50 rounded-2xl overflow-hidden shadow-2xl border-2 border-rose-200">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setEmojiIcon(e.emoji);
                          setOpenEmojiPicker(false);
                        }}
                        theme="light"
                      />
                    </div>
                  )}
                </div>

                {/* Budget Name with enhanced styling */}
                <div className="space-y-4">
                  <label className="text-rose-700 font-bold text-lg mb-3 block flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full animate-pulse"></div>
                    Budget Name
                    <Sparkles size={16} className="text-rose-500 animate-spin" />
                  </label>
                  <Input
                    placeholder="e.g., Monthly Groceries, Entertainment, Travel Fund..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-2 border-rose-200 focus:border-orange-500 focus:ring-orange-200 rounded-2xl h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-r from-white to-rose-50/30"
                  />
                </div>

                {/* Budget Amount with enhanced styling */}
                <div className="space-y-4">
                  <label className="text-orange-700 font-bold text-lg mb-3 block flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse"></div>
                    Budget Amount
                    <TrendingUp size={16} className="text-orange-500 animate-bounce" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-600 font-bold text-2xl">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border-2 border-orange-200 focus:border-amber-500 focus:ring-amber-200 rounded-2xl h-14 text-lg pl-12 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-r from-white to-orange-50/30"
                    />
                  </div>
                </div>

                {/* Parent Budget Selection with enhanced styling */}
                <div className="space-y-4">
                  <label className="text-amber-700 font-bold text-lg mb-3 block flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
                    Parent Budget (Optional)
                    <Star size={16} className="text-amber-500 animate-pulse" />
                  </label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full border-2 border-amber-200 p-4 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all duration-500 bg-gradient-to-r from-white to-amber-50/30 shadow-lg hover:shadow-xl h-14"
                  >
                    <option value="">Make this a Parent Budget</option>
                    {parentOptions.map((parent) => (
                      <option
                        key={parent.id}
                        value={parent.id}
                        className="text-gray-700 py-3"
                      >
                        Child of {parent.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enhanced Preview Card */}
                {(name || amount) && (
                  <div className="p-6 bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 rounded-2xl border-2 border-rose-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-200/30 to-amber-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                    <h3 className="text-lg font-bold text-rose-700 mb-4 flex items-center gap-2">
                      <Zap size={20} className="animate-pulse" />
                      Preview Your Budget:
                    </h3>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="text-4xl p-3 bg-white rounded-2xl shadow-lg">{emojiIcon}</div>
                      <div>
                        <p className="font-bold text-xl text-orange-800">{name || "Budget Name"}</p>
                        <p className="text-2xl font-bold text-amber-600">${amount || "0.00"}</p>
                        <p className="text-sm text-gray-600 mt-1">Ready to track your expenses!</p>
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
                className="w-full mt-8 bg-gradient-to-r from-rose-500 via-orange-600 to-amber-600 hover:from-rose-600 hover:via-orange-700 hover:to-amber-700 text-white font-bold py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 relative overflow-hidden group text-lg"
              >
                {/* Enhanced button effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 -skew-x-12 group-hover:animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Rocket size={20} className="animate-bounce" />
                  Create My Budget
                  <Sparkles size={20} className="animate-spin" />
                </span>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}