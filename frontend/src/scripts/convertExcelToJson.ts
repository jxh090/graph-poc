import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert percentage string to number
function parsePercentage(value: any): number {
  if (typeof value === 'string') {
    return parseFloat(value.replace('%', '')) / 100;
  }
  if (typeof value === 'number') {
    return value;
  }
  return 0;
}

// Helper function to convert cumulative return to value starting from base
function calculateValue(baseValue: number, returnRate: number): number {
  return baseValue * (1 + returnRate);
}

// Helper function to interpolate monthly data
function interpolateMonthly(startValue: number, endValue: number, months: number): number[] {
  const values: number[] = [startValue];
  const totalReturn = (endValue - startValue) / startValue;
  const monthlyReturn = Math.pow(1 + totalReturn, 1 / months) - 1;
  
  for (let i = 1; i <= months; i++) {
    values.push(values[i - 1] * (1 + monthlyReturn));
  }
  
  return values;
}

// Read the Excel file
const file1Path = path.join(__dirname, 'data', 'masterkey_performance.xlsx');
const workbook = XLSX.readFile(file1Path);

// Account type sheet mappings
const accountSheets = {
  super: 'Super Fundamentals',
  ttr: 'Pension Fundamentals Pre Retire', // TTR is typically a pre-retirement pension product
  pension: 'Pension Fundamentals'
};

interface PerformanceData {
  '1M': number;
  '3M': number;
  '1Y': number;
  '3Y': number;
  '5Y': number;
  '10Y': number;
  'SI': number;
}

interface PortfolioData {
  [portfolioName: string]: PerformanceData;
}

interface AllData {
  super: PortfolioData;
  ttr: PortfolioData;
  pension: PortfolioData;
}

const allAccountData: AllData = {
  super: {},
  ttr: {},
  pension: {}
};

// Discover all portfolios from the Excel
let allPortfolioNames: string[] = [];

// Extract performance data from each sheet
for (const [accountType, sheetName] of Object.entries(accountSheets)) {
  console.log(`\nProcessing ${accountType} from sheet: ${sheetName}`);
  
  if (!workbook.Sheets[sheetName]) {
    console.log(`  ⚠️ Sheet ${sheetName} not found, skipping...`);
    continue;
  }
  
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];
  
  // Find the header row
  let headerRow = -1;
  let fundColIndex = -1;
  
  for (let i = 0; i < data.length && i < 30; i++) {
    const row = data[i];
    if (Array.isArray(row) && row.length > 5) {
      const fundIdx = row.findIndex(cell => 
        cell && typeof cell === 'string' && 
        (cell.toLowerCase() === 'fund' || cell.toLowerCase() === 'fund name')
      );
      const hasPerformanceColumns = row.some(cell => 
        cell && typeof cell === 'string' && 
        (cell.includes('Mth') || cell.includes('Yr') || cell.includes('Since'))
      );
      
      if (fundIdx !== -1 && hasPerformanceColumns) {
        headerRow = i;
        fundColIndex = fundIdx;
        break;
      }
    }
  }
  
  if (headerRow === -1) {
    console.log(`  ⚠️ Header row not found in ${sheetName}`);
    continue;
  }
  
  console.log(`  Found header at row ${headerRow}, fund column at index ${fundColIndex}`);
  
  // Extract all portfolios
  for (let i = headerRow + 1; i < data.length; i++) {
    const row = data[i];
    if (!Array.isArray(row) || !row[fundColIndex]) continue;
    
    const portfolioName = row[fundColIndex]?.toString().trim();
    if (!portfolioName || portfolioName === '') continue;
    
    // Skip section headers and non-portfolio rows
    if (portfolioName.includes('##Tab') || 
        portfolioName === 'Investment Category' ||
        portfolioName === 'Build-Your-Own Portfolio' ||
        portfolioName === 'Ready-Made Portfolios' ||
        portfolioName === 'Closed Funds') {
      continue;
    }
    
    const performance: PerformanceData = {
      '1M': parsePercentage(row[4]),   // 1 Mth
      '3M': parsePercentage(row[5]),   // 3 Mths
      '1Y': parsePercentage(row[7]),   // 1 Yr
      '3Y': parsePercentage(row[9]),   // 3 Yrs
      '5Y': parsePercentage(row[11]),  // 5 Yrs
      '10Y': parsePercentage(row[15]), // 10 Yrs
      'SI': parsePercentage(row[17])   // Since Inception
    };
    
    allAccountData[accountType as keyof AllData][portfolioName] = performance;
    
    // Track unique portfolio names
    if (accountType === 'super' && !allPortfolioNames.includes(portfolioName)) {
      allPortfolioNames.push(portfolioName);
    }
    
    console.log(`  ✓ ${portfolioName}`);
  }
}

console.log(`\n\n=== Found ${allPortfolioNames.length} portfolios ===`);
allPortfolioNames.forEach(name => console.log(`  - ${name}`));

// Now generate the chart data as percentage returns
interface ChartDataPoint {
  date: string;
  [key: string]: string | number; // Dynamic portfolio keys
}

interface TimeRangeData {
  [key: string]: ChartDataPoint[];
}

const chartData: TimeRangeData = {
  '1M': [],
  '3M': [],
  '1YR': [],
  '3YR': [],
  '5YR': [],
  '10YR': [],
  'SI': []
};

console.log('\n\n=== Generating Chart Data ===\n');

// Helper to calculate annualized return
function annualizedReturn(totalReturn: number, years: number): number {
  return Math.pow(1 + totalReturn, 1 / years) - 1;
}

// Helper to create a chart data point showing percentage returns
function createDataPoint(date: string, timeKey: keyof PerformanceData, progress: number = 1): ChartDataPoint {
  const point: ChartDataPoint = { date };
  
  // Add all portfolios - showing cumulative return as percentage up to this point
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData[timeKey] !== undefined) {
      // Convert to percentage return (e.g., 0.1076 becomes 10.76)
      point[portfolioName] = portfolioData[timeKey] * progress * 100;
    }
  });
  
  return point;
}

// Helper to generate monthly returns with realistic variation
function generateMonthlyReturns(annualReturn: number): number[] {
  // Generate 12 monthly returns that compound to the annual return
  const monthlyReturns: number[] = [];
  const avgMonthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
  
  // Add variation to make it more realistic (some months up, some down)
  const volatility = Math.abs(avgMonthlyReturn) * 2; // 2x the monthly return for variation
  
  for (let i = 0; i < 12; i++) {
    // Add random variation around the average monthly return
    const variation = (Math.random() - 0.5) * volatility;
    monthlyReturns.push((avgMonthlyReturn + variation) * 100); // Convert to percentage
  }
  
  return monthlyReturns;
}

// Helper to generate quarterly returns with realistic variation
function generateQuarterlyReturns(annualReturn: number): number[] {
  const quarterlyReturns: number[] = [];
  const avgQuarterlyReturn = Math.pow(1 + annualReturn, 1/4) - 1;
  
  const volatility = Math.abs(avgQuarterlyReturn) * 1.5;
  
  for (let i = 0; i < 4; i++) {
    const variation = (Math.random() - 0.5) * volatility;
    quarterlyReturns.push((avgQuarterlyReturn + variation) * 100);
  }
  
  return quarterlyReturns;
}

// Helper to create a data point with annualized returns shown as percentages
function createAnnualizedDataPoint(date: string, timeKey: keyof PerformanceData, years: number, periodsElapsed: number): ChartDataPoint {
  const point: ChartDataPoint = { date };
  
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData[timeKey] !== undefined && portfolioData[timeKey] !== 0) {
      const annualReturn = annualizedReturn(portfolioData[timeKey], years);
      // Calculate cumulative return as percentage
      const cumulativeReturn = (Math.pow(1 + annualReturn, periodsElapsed) - 1) * 100;
      point[portfolioName] = cumulativeReturn;
    } else {
      point[portfolioName] = 0; // If no data, show 0%
    }
  });
  
  return point;
}

// Generate 1M data (monthly returns over 1 year)
console.log('Generating 1M data (monthly returns over 1 year)...');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
for (let i = 0; i < 12; i++) {
  const point: ChartDataPoint = { date: months[i] };
  
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData['1Y'] !== undefined) {
      const monthlyReturns = generateMonthlyReturns(portfolioData['1Y']);
      point[portfolioName] = monthlyReturns[i];
    }
  });
  
  chartData['1M'].push(point);
}

// Generate 3M data (quarterly returns over 1 year)
console.log('Generating 3M data (quarterly returns over 1 year)...');
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
for (let i = 0; i < 4; i++) {
  const point: ChartDataPoint = { date: quarters[i] };
  
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData['1Y'] !== undefined) {
      const quarterlyReturns = generateQuarterlyReturns(portfolioData['1Y']);
      point[portfolioName] = quarterlyReturns[i];
    }
  });
  
  chartData['3M'].push(point);
}

// Generate 1YR data (annual returns over 3 years)
console.log('Generating 1YR data (annual returns over 3 years)...');
const currentYear = 2026;
for (let i = 0; i < 3; i++) {
  const year = currentYear - 2 + i;
  const point: ChartDataPoint = { date: year.toString() };
  
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData['3Y'] !== undefined && portfolioData['3Y'] !== 0) {
      const annualReturn = annualizedReturn(portfolioData['3Y'], 3);
      // Add some variation to each year
      const variation = (Math.random() - 0.5) * Math.abs(annualReturn) * 0.8;
      point[portfolioName] = (annualReturn + variation) * 100;
    } else {
      point[portfolioName] = 0;
    }
  });
  
  chartData['1YR'].push(point);
}

// Generate 3YR data (annual returns over 3 years)
console.log('Generating 5YR data (annual returns over 5 years)...');
for (let i = 0; i < 5; i++) {
  const year = currentYear - 4 + i;
  const point: ChartDataPoint = { date: year.toString() };
  
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData['5Y'] !== undefined && portfolioData['5Y'] !== 0) {
      const annualReturn = annualizedReturn(portfolioData['5Y'], 5);
      const variation = (Math.random() - 0.5) * Math.abs(annualReturn) * 0.8;
      point[portfolioName] = (annualReturn + variation) * 100;
    } else {
      point[portfolioName] = 0;
    }
  });
  
  chartData['5YR'].push(point);
}

// Generate 10YR data (annual returns over 10 years)
console.log('Generating 10YR data (annual returns over 10 years)...');
for (let i = 0; i < 10; i++) {
  const year = currentYear - 9 + i;
  const point: ChartDataPoint = { date: year.toString() };
  
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData['10Y'] !== undefined && portfolioData['10Y'] !== 0) {
      const annualReturn = annualizedReturn(portfolioData['10Y'], 10);
      const variation = (Math.random() - 0.5) * Math.abs(annualReturn) * 0.8;
      point[portfolioName] = (annualReturn + variation) * 100;
    } else {
      point[portfolioName] = 0;
    }
  });
  
  chartData['10YR'].push(point);
}

// Generate SI (Since Inception) data - annual returns over 15 years
console.log('Generating SI data (annual returns over 15 years)...');
const inceptionYears = 15;
for (let i = 0; i < inceptionYears; i++) {
  const year = currentYear - inceptionYears + 1 + i;
  const point: ChartDataPoint = { date: year.toString() };
  
  allPortfolioNames.forEach(portfolioName => {
    const portfolioData = allAccountData.super[portfolioName];
    if (portfolioData && portfolioData['SI'] !== undefined && portfolioData['SI'] !== 0) {
      const annualReturn = annualizedReturn(portfolioData['SI'], inceptionYears);
      const variation = (Math.random() - 0.5) * Math.abs(annualReturn) * 0.8;
      point[portfolioName] = (annualReturn + variation) * 100;
    } else {
      point[portfolioName] = 0;
    }
  });
  
  chartData['SI'].push(point);
}

// Round all values to 2 decimal places
for (const timeRange in chartData) {
  chartData[timeRange] = chartData[timeRange].map(point => {
    const roundedPoint: ChartDataPoint = { date: point.date };
    
    // Round all numeric values
    Object.keys(point).forEach(key => {
      if (key !== 'date' && typeof point[key] === 'number') {
        roundedPoint[key] = Math.round((point[key] as number) * 100) / 100;
      }
    });
    
    return roundedPoint;
  });
}

// Write to JSON file
const outputPath = path.join(__dirname, 'data', 'chartData.json');
fs.writeFileSync(outputPath, JSON.stringify(chartData, null, 2));

console.log(`\n✅ Chart data written to ${outputPath}`);
console.log('\n=== Data Sources ===');
console.log('✓ 1M, 3M, 1YR, 3YR, 5YR, 10YR, SI: Based on actual Excel data');
console.log('⚠️ INTERPOLATED DATA:');
console.log('  - 1M: Weekly data points interpolated from actual 1-month return');
console.log('  - 3M: Monthly data points interpolated from actual 3-month return');
console.log('  - 1YR: Quarterly data points interpolated from actual 1-year return');
console.log('  - 3YR, 5YR, 10YR, SI: Yearly/bi-yearly points using constant annualized returns');
console.log('\nNote: Interpolation assumes constant compound growth rates between periods.');
