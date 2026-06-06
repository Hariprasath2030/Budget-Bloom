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
import { Plus, Wallet, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateBudget({ refreshData, parentOptions }) {
  const [emojiIcon, setEmojiIcon] = useState("💰");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [parentId, setParentId] = useState("");
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  const onCreateBudget = async () => {
    if (!name || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const result = await db
        .insert(Budgets)
        .values({
          name,
          amount: Number(amount),
          createdBy: user?.primaryEmailAddress?.emailAddress || "Anonymous",
          icon: emojiIcon,
          parentId: parentId || null,
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        refreshData();
        toast.success("Budget created!");
        setName("");
        setAmount("");
        setParentId("");
        setEmojiIcon("💰");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(99,102,241,0.15)" }}
          whileTap={{ scale: 0.97 }}
          className="relative bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 border-2 border-dashed border-blue-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer h-[180px] overflow-hidden group transition-all duration-300 hover:border-blue-400"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Plus size={26} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="font-black text-gray-800 text-base">New Budget</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Tap to create</p>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full bg-white border-0 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Wallet size={18} className="text-white" />
            </div>
            Create Budget
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Emoji picker */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider self-start">Choose Icon</p>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="w-20 h-20 text-4xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-3xl flex items-center justify-center shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emojiIcon}
              </motion.button>
              {openEmojiPicker && (
                <div className="absolute z-50 top-24 left-1/2 -translate-x-1/2 shadow-2xl rounded-2xl">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Budget Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Budget Name</label>
            <Input
              placeholder="e.g. Monthly Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 text-sm font-semibold"
            />
          </div>

          {/* Budget Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 text-sm font-semibold pl-8"
              />
            </div>
          </div>

          {/* Parent Budget */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parent Budget (optional)</label>
            <div className="relative">
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full h-12 border border-gray-200 bg-gray-50 rounded-2xl px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none transition-all duration-200"
              >
                <option value="">Standalone budget</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>Child of: {p.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Preview */}
          {(name || amount) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4"
            >
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">Preview</p>
              <div className="flex items-center gap-3">
                <div className="text-2xl w-12 h-12 bg-white rounded-2xl border border-blue-100 flex items-center justify-center shadow-sm">{emojiIcon}</div>
                <div>
                  <p className="font-black text-gray-900">{name || "Budget Name"}</p>
                  <p className="text-blue-600 font-bold text-sm">₹{amount || "0"}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="ghost" className="rounded-2xl text-gray-500 font-bold hover:bg-gray-100">
              Cancel
            </Button>
          </DialogClose>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Button
              disabled={!(name && amount)}
              onClick={onCreateBudget}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/25 text-base"
            >
              <Plus size={18} className="mr-2" />
              Create Budget
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
