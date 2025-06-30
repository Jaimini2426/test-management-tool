// --- Export CSV ---
function exportCSV(rows, headers, filename = 'report.csv') {
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// --- Export PDF ---
function exportPDF(text, filename = 'report.pdf') {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  doc.save(filename);
}

// --- Export Excel (.xlsx) with Bold Black Headers using ExcelJS ---
function exportExcel(rows, headers, filename = 'test-cases.xlsx') {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Test Cases");

  // Add and style header row
  const headerRow = sheet.addRow(headers);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FF000000' } };
  });

  // Add data rows
  rows.forEach(row => sheet.addRow(row));

  // Auto-size columns based on content
  sheet.columns.forEach(col => {
    let maxLen = 10;
    col.eachCell({ includeEmpty: true }, cell => {
      const len = (cell.value || '').toString().length;
      if (len > maxLen) maxLen = len;
    });
    col.width = maxLen + 2;
  });

  // Trigger Excel file download
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  });
  window.TestSuite = TestSuite;

}
