"use client";
import React, { useState } from "react";
import { Input } from "../../../../../@/components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { db } from "../../../../../utils/dbConfig";
import { Expenses } from "../../../../../utils/schema";
import { toast } from "sonner";
import moment from "moment";
import { Loader, Plus, Calendar, DollarSign, FileText } from "lucide-react";
import { motion } from "framer-motion";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);

  const addNewExpenses = async () => {
    setLoading(true);
    if (!user) {
      toast.error("User not found! Please log in.");
      setLoading(false);
      return;
    }
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name,
          amount: Number(amount),
          budgetId: Number(budgetId),
          createdAt: moment(selectedDate).format("DD/MM/YYYY"),
        })
        .returning({ insertedId: Expenses.id });

      setAmount("");
      setName("");
      setSelectedDate(moment().format("YYYY-MM-DD"));

      if (result.length > 0) {
        toast.success("Expense added!");
        refreshData();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      id: "name",
      label: "Expense Name",
      icon: FileText,
      iconColor: "text-emerald-500",
      placeholder: "e.g. Grocery shopping",
      type: "text",
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      id: "amount",
      label: "Amount",
      icon: DollarSign,
      iconColor: "text-emerald-500",
      placeholder: "0.00",
      type: "number",
      value: amount,
      onChange: (e) => setAmount(e.target.value),
    },
    {
      id: "date",
      label: "Date",
      icon: Calendar,
      iconColor: "text-emerald-500",
      placeholder: "",
      type: "date",
      value: selectedDate,
      onChange: (e) => setSelectedDate(e.target.value),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md">
          <Plus size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-black text-gray-900 text-lg leading-tight">Add Expense</h2>
          <p className="text-xs text-gray-400 font-medium">Track a new spending item</p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, i) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="space-y-1.5"
          >
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <field.icon size={14} className={field.iconColor} />
              {field.label}
            </label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={field.onChange}
              className="h-12 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-emerald-400/20 text-sm font-medium transition-all duration-200"
            />
          </motion.div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="mt-6">
        <Button
          disabled={!(name && amount) || loading}
          onClick={addNewExpenses}
          className="w-full h-13 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin" />
              Adding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus size={18} />
              Add Expense
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default AddExpense;
