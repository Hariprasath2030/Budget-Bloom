import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToPDF = (data, columns, title = 'Expense Report', dateRange = null) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add date range if provided
  if (dateRange && dateRange[0] && dateRange[1]) {
    doc.setFontSize(12);
    doc.text(`Date Range: ${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`, 20, 35);
  }
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, dateRange ? 45 : 35);
  
  // Prepare table data
  const tableColumns = columns.map(col => col.header);
  const tableRows = data.map(row => 
    columns.map(col => {
      const value = row[col.accessorKey];
      return value !== null && value !== undefined ? String(value) : '';
    })
  );
  
  // Add table
  doc.autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: dateRange ? 55 : 45,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });
  
  // Add summary if it's expense data
  if (data.length > 0 && data[0].amount) {
    const totalAmount = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, finalY);
    doc.text(`Total Records: ${data.length}`, 20, finalY + 10);
  }
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = (data, columns, title = 'Expense Report', dateRange = null) => {
  // Prepare data for Excel
  const excelData = data.map(row => {
    const newRow = {};
    columns.forEach(col => {
      newRow[col.header] = row[col.accessorKey];
    });
    return newRow;
  });
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Add metadata
  const metadata = [
    ['Report Title:', title],
    ['Generated On:', new Date().toLocaleString()],
  ];
  
  if (dateRange && dateRange[0] && dateRange[1]) {
    metadata.push(['Date Range:', `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`]);
  }
  
  if (data.length > 0 && data[0].amount) {
    const totalAmount = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    metadata.push(['Total Amount:', `$${totalAmount.toFixed(2)}`]);
    metadata.push(['Total Records:', data.length]);
  }
  
  // Insert metadata at the top
  XLSX.utils.sheet_add_aoa(ws, metadata, { origin: 'A1' });
  XLSX.utils.sheet_add_json(ws, excelData, { origin: `A${metadata.length + 2}` });
  
  // Auto-size columns
  const colWidths = columns.map(col => ({ wch: Math.max(col.header.length, 15) }));
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  
  // Save the file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (data, columns, title = 'Expense Report') => {
  // Prepare CSV data
  const csvData = [
    columns.map(col => col.header), // Header row
    ...data.map(row => columns.map(col => row[col.accessorKey] || ''))
  ];
  
  // Convert to CSV string
  const csvString = csvData.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  // Create and download blob
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
};