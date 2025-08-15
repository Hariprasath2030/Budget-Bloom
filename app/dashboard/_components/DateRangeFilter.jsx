"use client";
import React from "react";
import dayjs from "dayjs";
import { Calendar, Filter, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../@/components/ui/input";

function DateRangeFilter({ dateRange, onDateRangeChange }) {
  const handleStartDateChange = (e) => {
    const startDate = e.target.value ? dayjs(e.target.value) : null;
    onDateRangeChange([startDate, dateRange?.[1] || null]);
  };

  const handleEndDateChange = (e) => {
    const endDate = e.target.value ? dayjs(e.target.value) : null;
    onDateRangeChange([dateRange?.[0] || null, endDate]);
  };

  const clearDateRange = () => {
    onDateRangeChange([null, null]);
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-3xl border-2 border-blue-200 p-6 shadow-2xl relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-12 translate-x-12 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-200/30 to-blue-200/30 rounded-full translate-y-10 -translate-x-10 animate-pulse delay-500"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600 animate-bounce" size={20} />
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">Set Date Range</h3>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
        </div>
        {(dateRange?.[0] || dateRange?.[1]) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
          >
            <X size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Start Date
          </label>
          <Input
            type="date"
            value={dateRange?.[0] ? dateRange[0].format('YYYY-MM-DD') : ''}
            onChange={handleStartDateChange}
            className="w-full border-2 border-blue-200 focus:border-indigo-500 focus:ring-indigo-200 rounded-2xl h-12 bg-gradient-to-r from-white to-blue-50/30 shadow-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-indigo-700 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            End Date
          </label>
          <Input
            type="date"
            value={dateRange?.[1] ? dateRange[1].format('YYYY-MM-DD') : ''}
            onChange={handleEndDateChange}
            className="w-full border-2 border-indigo-200 focus:border-cyan-500 focus:ring-cyan-200 rounded-2xl h-12 bg-gradient-to-r from-white to-indigo-50/30 shadow-lg"
          />
        </div>
      </div>
      
      {(dateRange?.[0] || dateRange?.[1]) && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-cyan-100 rounded-2xl border-2 border-blue-200 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/50"></div>
          <div className="flex items-center gap-3 text-sm font-bold text-blue-700 relative z-10">
            <Filter size={18} className="animate-pulse" />
            <span>
              Filtering from {dateRange?.[0]?.format('MMM DD, YYYY') || 'beginning'} 
              {' to '} 
              {dateRange?.[1]?.format('MMM DD, YYYY') || 'end'}
            </span>
            <div className="flex gap-1 ml-auto">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-100"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;
