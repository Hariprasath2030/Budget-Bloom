import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const formatDate = (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '');

/**
 * Export data to PDF
 */
export const exportToPDF = async (data, columns, title = 'Expense Report', dateRange = null) => {
  // Dynamically import autoTable to avoid "doc.autoTable is not a function"
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text(title, 20, 20);

  // Date range
  if (dateRange && dateRange[0] && dateRange[1]) {
    doc.setFontSize(12);
    doc.text(
      `Date Range: ${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`,
      20,
      35
    );
  }

  // Timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 20, dateRange ? 45 : 35);

  // Table
  const tableColumns = columns.map(col => col.header || col.accessorKey);
  const tableRows = data.map(row =>
    columns.map(col => (row[col.accessorKey] != null ? String(row[col.accessorKey]) : ''))
  );

  // Use dynamically imported autoTable
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: dateRange ? 55 : 45,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // Optional summary
  if (data.length > 0 && data[0].amount != null) {
    const totalAmount = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, finalY);
    doc.text(`Total Records: ${data.length}`, 20, finalY + 10);
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${dayjs().format('YYYY-MM-DD')}.pdf`);
};

export const exportToExcel = (data, columns, title = 'Expense Report', dateRange = null) => {
  const excelData = data.map(row => {
    const newRow = {};
    columns.forEach(col => {
      newRow[col.header || col.accessorKey] = row[col.accessorKey];
    });
    return newRow;
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Add metadata
  const metadata = [
    ['Report Title:', title],
    ['Generated On:', dayjs().format('DD/MM/YYYY HH:mm')],
  ];
  if (dateRange && dateRange[0] && dateRange[1]) {
    metadata.push(['Date Range:', `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`]);
  }
  if (data.length > 0 && data[0].amount != null) {
    const totalAmount = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    metadata.push(['Total Amount:', `$${totalAmount.toFixed(2)}`]);
    metadata.push(['Total Records:', data.length]);
  }

  XLSX.utils.sheet_add_aoa(ws, metadata, { origin: 'A1' });
  XLSX.utils.sheet_add_json(ws, excelData, { origin: `A${metadata.length + 2}` });

  // Auto-size columns
  ws['!cols'] = columns.map(col => ({ wch: Math.max((col.header || col.accessorKey).length, 15) }));

  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${dayjs().format('YYYY-MM-DD')}.xlsx`);
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data, columns, title = 'Expense Report') => {
  const csvData = [
    columns.map(col => col.header || col.accessorKey),
    ...data.map(row => columns.map(col => (row[col.accessorKey] != null ? row[col.accessorKey] : ''))),
  ];

  const csvString = csvData
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${dayjs().format('YYYY-MM-DD')}.csv`);
};
