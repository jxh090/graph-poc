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

// Read first file
const workbook1 = XLSX.readFile(file1Path);
console.log('File 1: masterkey_performance.xlsx');
console.log('Sheet names:', workbook1.SheetNames);
console.log('\n');

workbook1.SheetNames.forEach((sheetName) => {
  const worksheet = workbook1.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(`Sheet: ${sheetName}`);
  console.log('First 10 rows:');
  console.log(JSON.stringify(jsonData.slice(0, 10), null, 2));
  console.log('\n---\n');
});

// Read second file
const workbook2 = XLSX.readFile(file2Path);
console.log('File 2: mlc_masterkey_business_super_and_personal_super.xlsx');
console.log('Sheet names:', workbook2.SheetNames);
console.log('\n');

workbook2.SheetNames.forEach((sheetName) => {
  const worksheet = workbook2.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(`Sheet: ${sheetName}`);
  console.log('First 10 rows:');
  console.log(JSON.stringify(jsonData.slice(0, 10), null, 2));
  console.log('\n---\n');
});
