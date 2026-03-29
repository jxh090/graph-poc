import XLSX from 'xlsx';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file1Path = path.join(__dirname, 'data', 'masterkey_performance.xlsx');
const workbook = XLSX.readFile(file1Path);
const sheetName = 'Super Fundamentals';
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];

console.log('\n=== Finding Fund Column ===');
// Find the header row - look for row with multiple column headers
let headerRow = -1;
let fundColIndex = -1;

for (let i = 0; i < data.length && i < 30; i++) {
  const row = data[i];
  if (Array.isArray(row) && row.length > 5) {
    // Look for a row that has "Fund" and performance period columns
    const fundIdx = row.findIndex(cell => 
      cell && typeof cell === 'string' && 
      (cell.toLowerCase() === 'fund' || cell.toLowerCase() === 'fund name')
    );
    const hasPerformanceColumns = row.some(cell => 
      cell && typeof cell === 'string' && 
      (cell.includes('Mth') || cell.includes('Yr') || cell.includes('Since'))
    );
    
    if (fundIdx !== -1 && hasPerformanceColumns) {
      console.log(`Found header at row ${i}:`);
      console.log(row.slice(0, 15));
      headerRow = i;
      fundColIndex = fundIdx;
      break;
    }
  }
}

console.log(`\nFund column index: ${fundColIndex}`);
console.log('\n=== All Fund Names ===');
const fundNames: string[] = [];
for (let i = headerRow + 1; i < data.length; i++) {
  const row = data[i];
  if (Array.isArray(row) && row[fundColIndex]) {
    const fundName = row[fundColIndex];
    if (fundName && typeof fundName === 'string' && fundName.trim() !== '') {
      fundNames.push(fundName);
      console.log(fundName);
    }
  }
}

console.log(`\n\nTotal portfolios found: ${fundNames.length}`);
