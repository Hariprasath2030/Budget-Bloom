"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Plus, Wallet, ChevronDown, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MobileBottomSheet({ open, onClose, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CreateBudget({ refreshData, parentOptions }) {
  const [emojiIcon, setEmojiIcon] = useState("💰");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [parentId, setParentId] = useState("");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const resetForm = () => {
    setName("");
    setAmount("");
    setParentId("");
    setEmojiIcon("💰");
    setOpenEmojiPicker(false);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

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
        handleClose();
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget");
    }
  };

  const formContent = (
    <div className="space-y-4">
      {/* Emoji picker */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="w-16 h-16 text-3xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-sm hover:border-blue-300 transition-all duration-200"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {emojiIcon}
          </motion.button>
          {openEmojiPicker && (
            <div className="absolute z-[60] top-20 left-0 shadow-2xl rounded-2xl">
              <EmojiPicker
                onEmojiClick={(e) => {
                  setEmojiIcon(e.emoji);
                  setOpenEmojiPicker(false);
                }}
                height={320}
              />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Budget Name</label>
          <Input
            placeholder="e.g. Monthly Groceries"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 text-sm font-semibold"
          />
        </div>
      </div>

      {/* Amount */}
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
      {parentOptions?.length > 0 && (
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
      )}

      {/* Preview */}
      <AnimatePresence>
        {(name || amount) && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 overflow-hidden"
          >
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <div className="text-2xl w-11 h-11 bg-white rounded-xl border border-blue-100 flex items-center justify-center shadow-sm flex-shrink-0">{emojiIcon}</div>
              <div className="min-w-0">
                <p className="font-black text-gray-900 truncate">{name || "Budget Name"}</p>
                <p className="text-blue-600 font-bold text-sm">₹{amount || "0"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const trigger = (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(99,102,241,0.15)" }}
      whileTap={{ scale: 0.97 }}
      className="relative bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 border-2 border-dashed border-blue-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer h-[180px] overflow-hidden group transition-all duration-300 hover:border-blue-400"
      onClick={() => setOpen(true)}
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
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <MobileBottomSheet open={open} onClose={handleClose}>
          <div className="px-5 pb-6 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Wallet size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Create Budget</h2>
                  <p className="text-xs text-gray-400 font-medium">Set your spending limit</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="w-9 h-9 bg-gray-100 rounded-2xl flex items-center justify-center"
              >
                <X size={18} className="text-gray-500" />
              </motion.button>
            </div>

            {formContent}

            {/* Action buttons */}
            <div className="mt-5 flex gap-3">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="flex-1 h-13 rounded-2xl text-gray-600 font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200"
              >
                Cancel
              </Button>
              <motion.div whileTap={{ scale: 0.97 }} className="flex-[2]">
                <Button
                  disabled={!(name && amount)}
                  onClick={onCreateBudget}
                  className="w-full h-13 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/25 text-base"
                >
                  <Check size={18} className="mr-2" />
                  Create Budget
                </Button>
              </motion.div>
            </div>
          </div>
        </MobileBottomSheet>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger}
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

        <div className="mt-2">
          {formContent}
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
