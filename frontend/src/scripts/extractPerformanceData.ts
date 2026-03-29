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

// Transform data into time series format
console.log('\n=== Transforming data into time series ===');

interface ChartDataPoint {
  date: string;
  [fundName: string]: string | number; // Fund names as keys with their return values
}

interface TimeSeriesData {
  [timeRange: string]: ChartDataPoint[];
}

// Helper function to parse percentage string to number
function parsePercent(value: string | number | null): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    return parseFloat(value.replace('%', ''));
  }
  return 0;
}

// Helper function to generate interpolated data points with realistic volatility
function generateTimeSeriesPoints(
  endDate: Date,
  periods: number,
  periodType: 'day' | 'week' | 'month' | 'quarter' | 'year',
  fundReturns: { [fundName: string]: number }
): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  
  // Calculate period length in days
  const periodDays: { [key: string]: number } = {
    day: 1,
    week: 7,
    month: 30,
    quarter: 91,
    year: 365
  };
  
  const totalDays = periods * periodDays[periodType];
  
  // Generate points
  for (let i = 0; i <= periods; i++) {
    const daysBack = totalDays - (i * periodDays[periodType]);
    const currentDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    const point: ChartDataPoint = { date: dateStr };
    
    // For each fund, calculate the return at this point
    for (const [fundName, finalReturn] of Object.entries(fundReturns)) {
      if (finalReturn === 0) {
        point[fundName] = 0;
        continue;
      }
      
      // Progress ratio (0 to 1)
      const progress = i / periods;
      
      // Use compound return calculation for smoother progression
      // Assumes returns compound over time
      const returnRate = finalReturn / 100; // Convert percentage to decimal
      const currentReturn = (Math.pow(1 + returnRate, progress) - 1) * 100;
      
      // Add some realistic volatility (±20% of the trend)
      const volatility = currentReturn * 0.2 * (Math.random() * 2 - 1);
      const withVolatility = i === periods ? finalReturn : currentReturn + volatility;
      
      point[fundName] = parseFloat(withVolatility.toFixed(4));
    }
    
    points.push(point);
  }
  
  return points;
}

// Base date: 28/02/2026
const baseDate = new Date('2026-02-28');

const timeSeriesData: TimeSeriesData = {};

// Prepare fund returns for each time period
const timeRanges: { [key: string]: { column: string; periods: number; periodType: 'day' | 'week' | 'month' | 'quarter' | 'year' } } = {
  '1M': { column: '1 Mth', periods: 4, periodType: 'week' },
  '3M': { column: '3 Mths', periods: 12, periodType: 'week' },
  '6M': { column: '6 Mths', periods: 6, periodType: 'month' },
  '1YR': { column: '1 Yr', periods: 12, periodType: 'month' },
  '3YR': { column: '3 Yrs', periods: 12, periodType: 'quarter' },
  '5YR': { column: '5 Yrs', periods: 5, periodType: 'year' },
  '7YR': { column: '7 Yrs', periods: 7, periodType: 'year' },
  '10YR': { column: '10 Yrs', periods: 10, periodType: 'year' }
};

for (const [rangeKey, config] of Object.entries(timeRanges)) {
  console.log(`  Processing ${rangeKey}...`);
  
  // Collect all fund returns for this time period
  const fundReturns: { [fundName: string]: number } = {};
  
  for (const row of extractedData) {
    const fundName = row.Fund;
    const returnValue = parsePercent(row[config.column as keyof PerformanceRow]);
    fundReturns[fundName] = returnValue;
  }
  
  // Generate time series points
  timeSeriesData[rangeKey] = generateTimeSeriesPoints(
    baseDate,
    config.periods,
    config.periodType,
    fundReturns
  );
}

// Handle "Since Inception % pa" separately if we have data
const sinceInceptionData = extractedData.filter(row => row['Since Inception % pa'] !== null);
if (sinceInceptionData.length > 0) {
  console.log(`  Processing SI...`);
  const fundReturns: { [fundName: string]: number } = {};
  
  for (const row of extractedData) {
    const fundName = row.Fund;
    const returnValue = parsePercent(row['Since Inception % pa']);
    fundReturns[fundName] = returnValue;
  }
  
  // Assume average inception is ~15 years for visualization
  timeSeriesData['SI'] = generateTimeSeriesPoints(
    baseDate,
    15,
    'year',
    fundReturns
  );
}

// Save to chartData.json
const outputPath = path.join(__dirname, 'data', 'chartData.json');
fs.writeFileSync(outputPath, JSON.stringify(timeSeriesData, null, 2), 'utf-8');

console.log(`✓ Data saved to ${outputPath}`);
console.log(`\nGenerated time series for ${Object.keys(timeSeriesData).length} time ranges`);
console.log('\nSample data (1M range, first 2 points):');
console.log(JSON.stringify(timeSeriesData['1M'].slice(0, 2), null, 2));
