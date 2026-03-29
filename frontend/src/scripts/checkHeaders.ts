import XLSX from 'xlsx';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'data', 'masterkey_performance.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];

// Find and print the header row
for (let i = 0; i < Math.min(data.length, 30); i++) {
  const row = data[i];
  if (Array.isArray(row)) {
    const hasFund = row.some(cell => cell && cell.toString().toLowerCase() === 'fund');
    const hasPerf = row.some(cell => cell && typeof cell === 'string' && (cell.includes('Mth') || cell.includes('Yr')));
    if (hasFund && hasPerf) {
      console.log('Header row found at index', i);
      console.log('\nAll columns:');
      row.forEach((col, idx) => {
        if (col) console.log(`  [${idx}]: ${col}`);
      });
      break;
    }
  }
}
