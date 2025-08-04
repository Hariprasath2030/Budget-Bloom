"use client";
import React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

function DateRangeFilter({ dateRange, onDateRangeChange }) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Filter by Date Range
      </h3>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateRangePicker"]}>
          <DemoItem>
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              localeText={{ start: "Start Date", end: "End Date" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1d4ed8",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "10px 12px",
                },
              }}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}

export default DateRangeFilter;
