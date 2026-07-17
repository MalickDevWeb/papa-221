export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
  );
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printTable(title: string, headers: string[], rows: any[][]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #1E293B; }
          h1 { color: #B3181C; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #E2DCDA; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #FAF8F6; color: #1E293B; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #E2DCDA; font-size: 12px; }
          td { padding: 10px; border: 1px solid #E2DCDA; font-size: 11px; }
          tr:nth-child(even) { background: #FDFDFD; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
