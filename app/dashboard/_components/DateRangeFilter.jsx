"use client";
import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Calendar, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

dayjs.extend(customParseFormat);

function DateRangeFilter({ dateRange, onDateRangeChange }) {
  const handleStartDateChange = (e) => {
    try {
      const startDate = e.target.value ? dayjs(e.target.value, "YYYY-MM-DD").startOf("day") : null;
      onDateRangeChange([startDate, dateRange?.[1] || null]);
    } catch {}
  };

  const handleEndDateChange = (e) => {
    try {
      const endDate = e.target.value ? dayjs(e.target.value, "YYYY-MM-DD").endOf("day") : null;
      onDateRangeChange([dateRange?.[0] || null, endDate]);
    } catch {}
  };

  const clearDateRange = () => onDateRangeChange([null, null]);

  const hasFilter = dateRange?.[0] || dateRange?.[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <Calendar size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Date Filter</h3>
            <p className="text-xs text-gray-400">Filter by date range</p>
          </div>
        </div>
        <AnimatePresence>
          {hasFilter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateRange}
                className="h-8 px-3 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl gap-1"
              >
                <X size={13} />
                Clear
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">From</label>
          <Input
            type="date"
            value={dateRange?.[0] && dayjs.isDayjs(dateRange[0]) ? dateRange[0].format("YYYY-MM-DD") : ""}
            onChange={handleStartDateChange}
            className="h-11 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 text-sm font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">To</label>
          <Input
            type="date"
            value={dateRange?.[1] && dayjs.isDayjs(dateRange[1]) ? dateRange[1].format("YYYY-MM-DD") : ""}
            onChange={handleEndDateChange}
            className="h-11 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 text-sm font-medium"
          />
        </div>
      </div>

      <AnimatePresence>
        {hasFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <Calendar size={13} className="text-amber-500 flex-shrink-0" />
              <span>
                {dateRange?.[0] && dayjs.isDayjs(dateRange[0]) ? dateRange[0].format("MMM D, YYYY") : "Start"}
                {" — "}
                {dateRange?.[1] && dayjs.isDayjs(dateRange[1]) ? dateRange[1].format("MMM D, YYYY") : "End"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DateRangeFilter;
