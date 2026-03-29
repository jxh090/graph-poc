import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Excel file
const filePath = path.join(__dirname, 'data', 'masterkey_performance.xlsx');
const workbook = XLSX.readFile(filePath);

// Get the first sheet (you can change this to target a specific sheet)
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

console.log(`Reading from sheet: ${sheetName}`);

// Convert sheet to array of arrays
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];

// Find the header row and column indices
let headerRow = -1;
const columnIndices: { [key: string]: number } = {};
const columnsToExtract = [
  'Fund',
  '1 Mth',
  '3 Mths',
  '6 Mths',
  '1 Yr',
  '3 Yrs',
  '5 Yrs',
  '7 Yrs',
  '10 Yrs',
  'Since Inception % pa'
];

// Search for the header row
for (let i = 0; i < Math.min(data.length, 30); i++) {
  const row = data[i];
  if (!Array.isArray(row)) continue;
  
  // Check if this row contains the columns we're looking for
  let foundColumns = 0;
  const tempIndices: { [key: string]: number } = {};
  
  for (let j = 0; j < row.length; j++) {
    const cellValue = row[j]?.toString().trim();
    if (cellValue) {
      for (const colName of columnsToExtract) {
        if (cellValue === colName || 
            cellValue.toLowerCase() === colName.toLowerCase() ||
            (colName === 'Fund' && (cellValue === 'Fund Name' || cellValue.toLowerCase() === 'fund name')) ||
            (colName === 'Since Inception % pa' && cellValue.includes('Since Inception'))) {
          tempIndices[colName] = j;
          foundColumns++;
        }
      }
    }
  }
  
  // If we found most of the columns, this is likely the header row
  if (foundColumns >= 5) {
    headerRow = i;
    Object.assign(columnIndices, tempIndices);
    break;
  }
}

if (headerRow === -1) {
  console.error('❌ Could not find header row with the required columns');
  process.exit(1);
}

console.log(`✓ Found header row at line ${headerRow + 1}`);
console.log('Column indices:', columnIndices);

// Extract the data
interface PerformanceRow {
  Fund: string;
  '1 Mth': string | number;
  '3 Mths': string | number;
  '6 Mths': string | number;
  '1 Yr': string | number;
  '3 Yrs': string | number;
  '5 Yrs': string | number;
  '7 Yrs': string | number;
  '10 Yrs': string | number;
  'Since Inception % pa': string | number;
}

const extractedData: PerformanceRow[] = [];

// Process data rows
for (let i = headerRow + 1; i < data.length; i++) {
  const row = data[i];
  if (!Array.isArray(row)) continue;
  
  // Get the fund name
  const fundName = row[columnIndices['Fund']]?.toString().trim();
  if (!fundName || fundName === '') continue;
  
  // Skip section headers and non-data rows
  if (fundName.includes('##Tab') || 
      fundName === 'Investment Category' ||
      fundName === 'Build-Your-Own Portfolio' ||
      fundName === 'Ready-Made Portfolios' ||
      fundName === 'Closed Funds') {
    continue;
  }
  
  // Create the row object
  const rowData: any = {
    Fund: fundName
  };
  
  // Extract each column
  for (const colName of columnsToExtract) {
    if (colName === 'Fund') continue; // Already handled
    
    if (columnIndices[colName] !== undefined) {
      const value = row[columnIndices[colName]];
      rowData[colName] = value !== undefined && value !== null && value !== '' ? value : null;
    } else {
      rowData[colName] = null;
    }
  }
  
  extractedData.push(rowData);
}

console.log(`✓ Extracted ${extractedData.length} rows`);

// Save to realChartData.json
const outputPath = path.join(__dirname, 'data', 'realChartData.json');
fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2), 'utf-8');

console.log(`✓ Data saved to ${outputPath}`);
console.log('\nSample data (first 3 rows):');
console.log(JSON.stringify(extractedData.slice(0, 3), null, 2));
