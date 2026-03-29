# Chart Data Source Documentation

## Data Generation Date
Generated on: March 5, 2026

## Source Files
- **Primary Source**: `masterkey_performance.xlsx`
- **Secondary Source**: `mlc_masterkey_business_super_and_personal_super.xlsx`

## Data Mapping

### Account Types
- **Super**: Data from "Super Fundamentals" sheet
- **TTR** (Transition to Retirement): Data from "Pension Fundamentals Pre Retire" sheet  
- **Pension**: Data from "Pension Fundamentals" sheet

### Portfolio Types
- **Conservative**: MLC Conservative Balanced
- **Balanced**: MLC Balanced
- **Growth**: MLC Growth

## Actual vs Interpolated Data

### ✅ ACTUAL DATA (from Excel)
The following performance periods come directly from the Excel files:
- **1 Month (1M)**: Actual return rate from column "1 Mth"
- **3 Months (3M)**: Actual return rate from column "3 Mths"
- **1 Year (1YR)**: Actual return rate from column "1 Yr"
- **3 Years (3YR)**: Actual annualized return rate from column "3 Yrs"
- **5 Years (5YR)**: Actual annualized return rate from column "5 Yrs"
- **10 Years (10YR)**: Actual annualized return rate from column "10 Yrs"
- **Since Inception (SI)**: Actual annualized return rate from column "Since Inception"

### ⚠️ INTERPOLATED DATA (calculated)
To create smooth chart visualizations, we interpolated data points between actual periods:

#### 1M Time Range
- **Method**: Linear interpolation with compound growth
- **Data Points**: 4 weekly points (Week 1, Week 2, Week 3, Week 4)
- **Calculation**: Applied 1-month return evenly across 4 weeks using compound growth formula
- **Assumption**: Constant compound growth rate throughout the month

#### 3M Time Range  
- **Method**: Linear interpolation with compound growth
- **Data Points**: 3 monthly points (Month 1, Month 2, Month 3)
- **Calculation**: Applied 3-month return evenly across 3 months using compound growth formula
- **Assumption**: Constant compound growth rate throughout the quarter

#### 1YR Time Range
- **Method**: Linear interpolation with compound growth
- **Data Points**: 4 quarterly points (Q1, Q2, Q3, Q4)
- **Calculation**: Applied 1-year return evenly across 4 quarters using compound growth formula
- **Assumption**: Constant compound growth rate throughout the year

#### 3YR Time Range
- **Method**: Annualized return applied yearly
- **Data Points**: 3 yearly points (2024, 2025, 2026)
- **Calculation**: Calculated annualized return from 3-year return, then compounded for each year
- **Assumption**: Constant annualized growth rate each year

#### 5YR Time Range
- **Method**: Annualized return applied yearly
- **Data Points**: 5 yearly points (2022, 2023, 2024, 2025, 2026)
- **Calculation**: Calculated annualized return from 5-year return, then compounded for each year
- **Assumption**: Constant annualized growth rate each year

#### 10YR Time Range
- **Method**: Annualized return applied bi-yearly
- **Data Points**: 6 bi-yearly points (2016, 2018, 2020, 2022, 2024, 2026)
- **Calculation**: Calculated annualized return from 10-year return, then compounded for every 2 years
- **Assumption**: Constant annualized growth rate throughout the period

#### SI (Since Inception) Time Range
- **Method**: Annualized return applied bi-yearly (assuming 15-year inception)
- **Data Points**: 8 bi-yearly points
- **Calculation**: Calculated annualized return from SI return, then compounded for every 2 years
- **Assumption**: 
  - Constant annualized growth rate throughout the period
  - Inception assumed to be 15 years ago (actual inception dates vary by fund)

## Performance Data Summary

### Super (MLC Balanced)
- 1 Month: 1.12%
- 3 Months: 2.65%
- 1 Year: 10.76%
- 3 Years: 9.80% p.a.
- 5 Years: 7.74% p.a.
- 10 Years: 7.83% p.a.
- Since Inception: 6.28% p.a.

### TTR (MLC Balanced) 
- 1 Month: 1.12%
- 3 Months: 2.65%
- 1 Year: 10.76%
- 3 Years: 9.80% p.a.
- 5 Years: 7.74% p.a.
- 10 Years: 0.00% p.a. (⚠️ Not available in source data)
- Since Inception: 7.20% p.a.

### Pension (MLC Balanced)
- 1 Month: 1.21%
- 3 Months: 2.88%
- 1 Year: 11.80%
- 3 Years: 10.78% p.a.
- 5 Years: 8.59% p.a.
- 10 Years: 8.74% p.a.
- Since Inception: 6.90% p.a.

### Portfolio Comparisons (Using Super account type)

#### Conservative (MLC Conservative Balanced)
- 1 Month: 1.00%
- 3 Months: 2.33%
- 1 Year: 9.58%
- 3 Years: 8.34% p.a.
- 5 Years: 6.44% p.a.
- 10 Years: 6.32% p.a.
- Since Inception: 6.41% p.a.

#### Balanced (MLC Balanced)
- 1 Month: 1.12%
- 3 Months: 2.65%
- 1 Year: 10.76%
- 3 Years: 9.80% p.a.
- 5 Years: 7.74% p.a.
- 10 Years: 7.83% p.a.
- Since Inception: 6.28% p.a.

#### Growth (MLC Growth)
- 1 Month: 1.25%
- 3 Months: 2.87%
- 1 Year: 11.31%
- 3 Years: 10.79% p.a.
- 5 Years: 8.87% p.a.
- 10 Years: 8.90% p.a.
- Since Inception: 6.71% p.a.

## Important Notes

1. **Base Value**: All calculations start from a base value of $10,000
2. **Rounding**: All final values are rounded to 2 decimal places
3. **Returns**: Percentages in source data were converted to decimal format for calculations
4. **Missing Data**: TTR 10-year data was not available in the source Excel file (showed as 0.00%)
5. **Compound Growth**: All interpolations use compound growth formulas, not simple linear growth
6. **Data Accuracy**: Actual return data is accurate as of February 28, 2026 (from Excel file header)

## Limitations

1. **Volatility Not Represented**: Interpolated data assumes smooth, constant growth. Real market returns include volatility and fluctuations not captured here.
2. **Historical Accuracy**: Interpolated historical points do not represent actual historical performance at those specific dates.
3. **Inception Dates**: Since Inception period assumes 15 years for all funds, but actual inception dates vary by fund.
4. **Extrapolation**: Future projections or estimates are not included; all data represents past performance only.

## Usage Recommendation

- Use actual period data (1M, 3M, 1YR, 3YR, 5YR, 10YR, SI) for reporting and comparisons
- Interpolated data points are for visualization purposes only
- Do not use interpolated data for performance calculations or regulatory reporting
