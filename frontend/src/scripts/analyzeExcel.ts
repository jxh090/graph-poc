import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Excel files
const file1Path = path.join(__dirname, 'data', 'masterkey_performance.xlsx');
const file2Path = path.join(__dirname, 'data', 'mlc_masterkey_business_super_and_personal_super.xlsx');

console.log('Reading Excel files...\n');

// Read first file - masterkey_performance
const workbook1 = XLSX.readFile(file1Path);
console.log('=== File 1: masterkey_performance.xlsx ===\n');

// Focus on Super Fundamentals and Pension Fundamentals
const superSheet = workbook1.Sheets['Super Fundamentals'];
const superData = XLSX.utils.sheet_to_json(superSheet, { header: 1, raw: false });

console.log('Super Fundamentals - Checking for portfolios:\n');
superData.slice(0, 50).forEach((row: any, idx) => {
  if (Array.isArray(row) && row.length > 1) {
    const fundName = row[1]?.toString().toLowerCase() || '';
    if (fundName.includes('conservative') || 
        fundName.includes('balanced') || 
        fundName.includes('growth') ||
        fundName.includes('mysuper') ||
        fundName.includes('lifecycle')) {
      console.log(`Row ${idx}:`, JSON.stringify(row.slice(0, 18)));
    }
  }
});

// Read second file
console.log('\n\n=== File 2: mlc_masterkey_business_super_and_personal_super.xlsx ===\n');
const workbook2 = XLSX.readFile(file2Path);
console.log('Sheet names:', workbook2.SheetNames);

workbook2.SheetNames.forEach((sheetName) => {
  const worksheet = workbook2.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
  console.log(`\n${sheetName} - First 20 rows:`);
  jsonData.slice(0, 20).forEach((row: any, idx) => {
    if (Array.isArray(row) && row.length > 0) {
      console.log(`Row ${idx}:`, JSON.stringify(row.slice(0, 10)));
    }
  });
});
