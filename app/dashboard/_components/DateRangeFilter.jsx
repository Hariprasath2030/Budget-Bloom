"use client";
import React from "react";
import dayjs from "dayjs";
import { Calendar, Filter, X, Sparkles } from "lucide-react";
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
    <div className="relative bg-white rounded-2xl border border-orange-200 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/50 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-100/30 rounded-full translate-y-10 -translate-x-10"></div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl">
            <Calendar className="text-white" size={20} />
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-800">Set Date Range</h3>
          <Sparkles className="text-orange-400 animate-pulse" size={16} />
        </div>
        {(dateRange?.[0] || dateRange?.[1]) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Start Date
          </label>
          <Input
            type="date"
            value={dateRange?.[0] ? dateRange[0].format('YYYY-MM-DD') : ''}
            onChange={handleStartDateChange}
            className="w-full h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            End Date
          </label>
          <Input
            type="date"
            value={dateRange?.[1] ? dateRange[1].format('YYYY-MM-DD') : ''}
            onChange={handleEndDateChange}
            className="w-full h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl"
          />
        </div>
      </div>
      
      {(dateRange?.[0] || dateRange?.[1]) && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 relative z-10">
          <div className="flex items-center gap-2 text-sm text-orange-700 font-medium">
            <Filter size={16} className="text-orange-500" />
            <span>
              Filtering from {dateRange?.[0]?.format('MMM DD, YYYY') || 'beginning'} 
              {' to '} 
              {dateRange?.[1]?.format('MMM DD, YYYY') || 'end'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;
