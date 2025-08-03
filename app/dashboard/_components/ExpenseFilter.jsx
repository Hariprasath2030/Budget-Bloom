"use client";
import React, { useState } from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { Paper, Typography, Box, Button } from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import dayjs from 'dayjs';

function ExpenseFilter({ onDateRangeChange, onClearFilter }) {
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateRangeChange = (newValue) => {
    setDateRange(newValue);
    onDateRangeChange(newValue);
  };

  const handleClearFilter = () => {
    setDateRange([null, null]);
    onClearFilter();
  };

  return (
    <Paper elevation={2} className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
      <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FilterList className="text-blue-600" />
          <Typography variant="h6" className="font-semibold text-gray-800 dark:text-gray-200">
            Filter Expenses
          </Typography>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateRangePicker']}>
              <DemoItem>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  localeText={{ start: 'Start Date', end: 'End Date' }}
                  className="bg-white rounded-lg"
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
          
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearFilter}
            className="whitespace-nowrap"
            disabled={!dateRange[0] && !dateRange[1]}
          >
            Clear Filter
          </Button>
        </div>
      </Box>
    </Paper>
  );
}

export default ExpenseFilter;