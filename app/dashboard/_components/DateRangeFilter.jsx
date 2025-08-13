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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Date Range Filter</h3>
        </div>
        {(dateRange?.[0] || dateRange?.[1]) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <X size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <Input
            type="date"
            value={dateRange?.[0] ? dateRange[0].format('YYYY-MM-DD') : ''}
            onChange={handleStartDateChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={dateRange?.[1] ? dateRange[1].format('YYYY-MM-DD') : ''}
            onChange={handleEndDateChange}
            className="w-full"
          />
        </div>
      </div>
      
      {(dateRange?.[0] || dateRange?.[1]) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Filter size={16} />
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
