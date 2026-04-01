import { useState, useEffect } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import {
    Container,
    Section,
    SectionTitle,
    ButtonGroup,
    Button,
    ChartCard,
    ChartHeader,
    CheckboxLabel,
    ChartWrapper,
    ChartButton,
    ChartButtonGroup,
    FlexBox,
} from "./App.styles";

type AccountType = "Super" | "ttr" | "pension";
type TimeRange = "1M" | "3M" | "1YR" | "3YR" | "5YR" | "10YR" | "SI";

const TIME_RANGES: TimeRange[] = ["1M", "3M", "1YR", "3YR", "5YR", "10YR", "SI"];

type PortfolioGroup = {
    label: string;
    portfolios: string[];
};

type PortfolioSection = {
    label: string;
    groups: PortfolioGroup[];
};

type AccordionProps = {
    groups: PortfolioSection[];
    selectedPortfolios: Set<string>;
    togglePortfolio: (portfolio: string) => void;
    portfolioColors: Record<string, string>;
};

// All available portfolios from Excel
const ALL_PORTFOLIOS = [
    "Altrinsic Global Equities Trust",
    "Antares Elite Opportunities Fund",
    "Antares High Growth Shares Fund",
    "Ausbil Australian Emerging Leaders Fund",
    "Fairview Equity Partners Emerging Companies Fund",
    "Investors Mutual Australian Share Fund",
    "MLC Australian Fixed Interest Index",
    "MLC Australian Property Index",
    "MLC Australian Shares",
    "MLC Australian Shares Index",
    "MLC Fixed Interest",
    "MLC IncomeBuilder",
    "MLC International Shares **",
    "MLC International Shares Index (Hedged) **",
    "MLC International Shares Index **",
    "MLC Property",
    "Perpetual Australian Share Fund",
    "Schroder Wholesale Australian Equity Fund",
    "MLC Aggressive",
    "MLC Balanced",
    "MLC Conservative Balanced **",
    "MLC Growth",
    "MLC High Growth",
    "MLC Low Cost Balanced",
    "MLC Low Cost Conservative Balanced",
    "MLC Low Cost Growth",
    "MLC Socially Responsible Growth",
    "MLC Stable *",
] as const;

type PortfolioType = (typeof ALL_PORTFOLIOS)[number];

// Generate distinct colors for all portfolios
function generatePortfolioColors(): Record<string, string> {
    const colors: Record<string, string> = {};
    const hueStep = 360 / ALL_PORTFOLIOS.length;

    ALL_PORTFOLIOS.forEach((portfolio, index) => {
        const hue = (index * hueStep) % 360;
        const saturation = 65 + (index % 3) * 10;
        const lightness = 45 + (index % 4) * 5;
        colors[portfolio] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });

    return colors;
}
const PORTFOLIO_GROUPS = [
    {
        label: "Ready made portfolios",
        groups: [
            {
                label: "MLC Simple Choice",
                portfolios: [
                    "MLC Aggressive",
                    "MLC Growth",
                    "MLC High Growth",
                    "MLC Balanced",
                    "MLC Stable *",
                    "MLC Conservative Balanced **",
                ],
            },
            {
                label: "MLC Low Cost",
                portfolios: [
                    "MLC Low Cost Growth",
                    "MLC Low Cost Conservative Balanced",
                    "MLC Low Cost Balanced",
                ],
            },
            {
                label: "MLC Socially Responsible",
                portfolios: ["MLC Socially Responsible Growth"],
            },
        ],
    },
    {
        label: "Build-your-own-portfolio",
        groups: [
            {
                label: "Cash and Fixed Interest",
                portfolios: [
                    "MLC Cash",
                    "MLC Australian Fixed Interest Index",
                    "MLC Fixed Interest",
                    "NAB Term Deposit",
                ],
            },
            {
                label: "Property",
                portfolios: ["MLC Property", "MLC Australian Property Index"],
            },
            {
                label: "Global Shares",
                portfolios: [
                    "MLC International Shares **",
                    "MLC International Shares Index **",
                    "MLC International Shares Index (Hedged) **",
                    "Altrinsic Global Equities Trust",
                ],
            },
            {
                label: "Australian Shares",
                portfolios: [
                    "Antares Elite Opportunities Fund",
                    "Antares High Growth Shares Fund",
                    "Ausbil Australian Emerging Leaders Fund",
                    "Fairview Equity Partners Emerging Companies Fund",
                    "Investors Mutual Australian Share Fund",
                    "MLC Australian Shares",
                    "MLC Australian Shares Index",
                    "MLC IncomeBuilder",
                    "Perpetual Australian Share Fund",
                    "Schroder Wholesale Australian Equity Fund",
                ],
            },
        ],
    },
];

function Accordion({
    groups,
    selectedPortfolios,
    togglePortfolio,
    portfolioColors,
}: AccordionProps) {
    const [openSections, setOpenSections] = useState<{
        [key: string]: boolean;
    }>({
        "Ready made portfolios": true,
        "Build-your-own-portfolio": true,
    });

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div>
            {groups.map((section: PortfolioSection) => (
                <div key={section.label}>
                    <div
                        style={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginTop: 12,
                            marginBottom: 4,
                        }}
                        onClick={() => toggleSection(section.label)}
                    >
                        {section.label}{" "}
                        {openSections[section.label] ? "▼" : "▶"}
                    </div>
                    {openSections[section.label] && (
                        <div style={{ marginLeft: 16 }}>
                            {section.groups.map((group: PortfolioGroup) => (
                                <div
                                    key={group.label}
                                    style={{ marginBottom: 8 }}
                                >
                                    <div
                                        style={{
                                            fontWeight: 500,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {group.label}
                                    </div>
                                    {group.portfolios.map((portfolio: string) => (
                                        <CheckboxLabel
                                            key={portfolio}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                minWidth: 0,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPortfolios.has(
                                                    portfolio,
                                                )}
                                                onChange={() =>
                                                    togglePortfolio(portfolio)
                                                }
                                            />
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: "8px",
                                                    height: "8px",
                                                    backgroundColor:
                                                        portfolioColors[
                                                            portfolio
                                                        ],
                                                    borderRadius: "50%",
                                                    marginRight: "4px",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    flex: 1,
                                                }}
                                            >
                                                {portfolio}
                                            </span>
                                        </CheckboxLabel>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Color palette for investment fees
const FEE_COLORS: Record<string, string> = {
    "Admin Fee": "#3B82F6",
    "Other Admin Fees & Costs": "#F59E0B",
    "Investment Fees & Costs": "#10B981",
    "Transaction Costs": "#EF4444",
};

function App() {
    const [viewMode, setViewMode] = useState<"chart" | "table" | "pie">(
        "chart",
    );
    const [accountType, setAccountType] = useState<AccountType>("Super");
    const [timeRange, setTimeRange] = useState<TimeRange>("10YR");
    const [selectedPortfolios, setSelectedPortfolios] = useState<Set<string>>(
        new Set(["MLC High Growth"]),
    );

    const [realData, setRealData] =
        useState<Record<TimeRange, Array<Record<string, number | string>>>>();

    const [investmentFeesData, setInvestmentFeesData] = useState<
        Array<{
            name: string;
            adminFee: number;
            otherAdminFeesAndCosts: number;
            investmentFeesAndCosts: number;
            transactionCosts: number;
        }>
    >([]);
    const [selectedFund, setSelectedFund] = useState<string | null>(null);

    useEffect(() => {
        // fetch("http://localhost:3000/chartData.json")
        fetch(`${import.meta.env.BASE_URL}chartData.json`)
            .then((response) => response.json())
            .then((data) => {
                setRealData(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    useEffect(() => {
        // fetch("http://localhost:3000/investmentFees.json")
        fetch(`${import.meta.env.BASE_URL}investmentFees.json`)
            .then((response) => response.json())
            .then((data) => {
                setInvestmentFeesData(data.funds);
                if (data.funds.length > 0) {
                    setSelectedFund(data.funds[0].name);
                }
            })
            .catch((error) => {
                console.error("Error fetching investment fees:", error);
            });
    }, []);

    // Data is already in percentage format from the conversion script
    const data = realData ? realData[timeRange] : [];

    const portfolioColors = generatePortfolioColors();

    const togglePortfolio = (portfolio: string) => {
        const newSelected = new Set(selectedPortfolios);
        // if (selectedPortfolios.size >= 4) {
        //     console.error("You can only select up to 4 portfolios at a time."); // Log error when limit is reached
        //     return; // Limit to 4 portfolios
        // }
        if (newSelected.has(portfolio)) {
            newSelected.delete(portfolio);
        } else {
            newSelected.add(portfolio);
        }
        setSelectedPortfolios(newSelected);
    };

    const clearAllPortfolios = () => {
        setSelectedPortfolios(new Set());
    };

    const getPortfolioReturn = (
        range: TimeRange,
        portfolio: PortfolioType,
    ): string => {
        const rangeData = realData?.[range];
        const latestEntry = rangeData?.[rangeData.length - 1];
        const value = latestEntry?.[portfolio];

        return typeof value === "number" ? `${value.toFixed(2)}%` : "N/A";
    };

    return (
        <Container>
            {/* Account Type Toggle */}
            <Section
                style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    flexDirection: "row",
                }}
            >
                <ButtonGroup>
                    {(["Super", "TTR", "Pension"] as AccountType[]).map(
                        (type) => (
                            <Button
                                key={type}
                                $isActive={accountType === type}
                                onClick={() => setAccountType(type)}
                            >
                                {type}
                            </Button>
                        ),
                    )}
                </ButtonGroup>
                <ButtonGroup>
                    {["CHART", "TABLE", "PIE"].map((type) => (
                        <Button
                            key={type}
                            $isActive={viewMode === type.toLowerCase()}
                            onClick={() =>
                                setViewMode(
                                    type.toLowerCase() as
                                        | "chart"
                                        | "table"
                                        | "pie",
                                )
                            }
                        >
                            {type}
                        </Button>
                    ))}
                </ButtonGroup>
            </Section>

            {/* Integrated Chart with Controls */}
            <ChartCard>
                <div>
                    <h2>Investments over time</h2>
                    <ChartButtonGroup>
                        {TIME_RANGES.map((range) => (
                            <ChartButton
                                key={range}
                                $isActive={timeRange === range}
                                onClick={() => setTimeRange(range)}
                            >
                                {range === "SI" ? "SI" : range}
                            </ChartButton>
                        ))}
                    </ChartButtonGroup>
                </div>
                {viewMode === "chart" && (
                    <>
                        <ChartWrapper>
                            <ResponsiveContainer width="100%" height={800}>
                                <LineChart key={timeRange} data={data}>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => {
                                            const d = new Date(value);
                                            return d.toLocaleDateString(
                                                "en-AU",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                },
                                            );
                                        }}
                                    />
                                    <YAxis
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        domain={["auto", "auto"]}
                                        tickFormatter={(value) =>
                                            `${value.toFixed(0)}%`
                                        }
                                    />
                                    <CartesianGrid vertical={false} />

                                    {/* Portfolio Type Lines (conditionally rendered) */}
                                    {ALL_PORTFOLIOS.map((portfolio) =>
                                        selectedPortfolios.has(portfolio) ? (
                                            <Line
                                                key={portfolio}
                                                dataKey={portfolio}
                                                name={portfolio}
                                                stroke={
                                                    portfolioColors[portfolio]
                                                }
                                                strokeWidth={2}
                                                dot={false}
                                                connectNulls
                                                animationDuration={1000}
                                            />
                                        ) : null,
                                    )}

                                    <Tooltip
                                        formatter={(value) =>
                                            typeof value === 'number'
                                                ? `${value.toFixed(2)}%`
                                                : "N/A"
                                        }
                                        labelStyle={{
                                            color: "#2c3e50",
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Legend />
                                    <RechartsDevtools />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                        <ChartHeader>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <SectionTitle
                                        style={{
                                            marginBottom: "0",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Compare Investments
                                    </SectionTitle>
                                    <div>
                                        <Button
                                            $isActive={false}
                                            onClick={clearAllPortfolios}
                                            style={{
                                                padding: "4px 12px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        overflowY: "auto",
                                        padding: "4px",
                                    }}
                                >
                                    <Accordion
                                        groups={PORTFOLIO_GROUPS}
                                        selectedPortfolios={selectedPortfolios}
                                        togglePortfolio={togglePortfolio}
                                        portfolioColors={portfolioColors}
                                    />
                                </div>
                            </div>
                        </ChartHeader>
                    </>
                )}
                {viewMode === "table" && (
                    <FlexBox
                        gap={20}
                        direction={"column"}
                        style={{ height: "800px" }}
                    >
                        <div
                            style={{
                                overflow: "auto",
                                width: "100%",
                                height: "100%",
                                border: "1px solid #2c3e50",
                                borderRadius: "8px",
                            }}
                        >
                            <div
                                style={{
                                    minWidth: "900px",
                                    display: "grid",
                                    gridTemplateColumns:
                                        "minmax(320px, 2fr) repeat(7, minmax(90px, 1fr))",
                                    alignItems: "center",
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        top: 0,
                                        padding: "16px 20px",
                                        fontWeight: 700,
                                        borderBottom: "1px solid #2c3e50",
                                        backgroundColor: "#f6f8f8",
                                        position: "sticky",
                                        left: 0,
                                        zIndex: 4,
                                    }}
                                >
                                    Portfolio
                                </div>
                                {TIME_RANGES.map((range) => (
                                    <div
                                        key={range}
                                        style={{
                                            position: "sticky",
                                            top: 0,
                                            padding: "16px 12px",
                                            textAlign: "center",
                                            fontWeight:
                                                timeRange === range ? 700 : 500,
                                            borderBottom:
                                                "1px solid #2c3e50",
                                            backgroundColor:
                                                timeRange === range
                                                    ? "#eef4ff"
                                                    : "#f6f8f8",
                                            zIndex: 3,
                                        }}
                                    >
                                        {range}
                                    </div>
                                ))}

                                {ALL_PORTFOLIOS.map((portfolio, index) => (
                                    <div
                                        key={portfolio}
                                        style={{ display: "contents" }}
                                    >
                                        <div
                                            style={{
                                                padding: "18px 20px",
                                                fontWeight: 600,
                                                borderBottom:
                                                    index === ALL_PORTFOLIOS.length - 1
                                                        ? "none"
                                                        : "1px solid #d7dadc",
                                                backgroundColor: "#fff",
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 1,
                                            }}
                                        >
                                            {portfolio}
                                        </div>
                                        {TIME_RANGES.map((range) => (
                                            <div
                                                key={`${portfolio}-${range}`}
                                                style={{
                                                    padding: "18px 12px",
                                                    height: '100%',
                                                    textAlign: "center",
                                                    alignContent: "center",
                                                    fontWeight:
                                                        timeRange === range
                                                            ? 700
                                                            : 400,
                                                    backgroundColor:
                                                        timeRange === range
                                                            ? "#f8fbff"
                                                            : "#fff",
                                                    borderBottom:
                                                        index === ALL_PORTFOLIOS.length - 1
                                                            ? "none"
                                                            : "1px solid #d7dadc",
                                                }}
                                            >
                                                {getPortfolioReturn(
                                                    range,
                                                    portfolio,
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FlexBox>
                )}
                {viewMode === "pie" && (
                    <>
                        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                            <label htmlFor="fund-select" style={{ marginRight: "10px", fontWeight: "bold" }}>
                                Select Fund:
                            </label>
                            <select
                                id="fund-select"
                                value={selectedFund || ""}
                                onChange={(e) => setSelectedFund(e.target.value)}
                                style={{
                                    padding: "8px 12px",
                                    fontSize: "14px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    maxWidth: "400px",
                                    width: "100%",
                                }}
                            >
                                <option value="">-- Select a fund --</option>
                                {investmentFeesData.map((fund) => (
                                    <option key={fund.name} value={fund.name}>
                                        {fund.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedFund && investmentFeesData.length > 0 ? (
                            <ResponsiveContainer height={500} width="100%">
                                <PieChart height={400} width={400}>
                                    <Pie
                                        cx="50%"
                                        cy="50%"
                                        data={(() => {
                                            const fund = investmentFeesData.find(
                                                (f) => f.name === selectedFund,
                                            );
                                            if (!fund) return [];
                                            return [
                                                {
                                                    name: "Admin Fee",
                                                    value: fund.adminFee,
                                                    fill: FEE_COLORS["Admin Fee"],
                                                },
                                                {
                                                    name: "Other Admin Fees & Costs",
                                                    value: fund.otherAdminFeesAndCosts,
                                                    fill: FEE_COLORS["Other Admin Fees & Costs"],
                                                },
                                                {
                                                    name: "Investment Fees & Costs",
                                                    value: fund.investmentFeesAndCosts,
                                                    fill: FEE_COLORS["Investment Fees & Costs"],
                                                },
                                                {
                                                    name: "Transaction Costs",
                                                    value: fund.transactionCosts,
                                                    fill: FEE_COLORS["Transaction Costs"],
                                                },
                                            ];
                                        })()}
                                        dataKey="value"
                                        innerRadius={60}
                                        outerRadius={80}
                                        animationDuration={100}
                                        animationBegin={0}
                                        label={({ name, value }) =>
                                            `${name}: ${value.toFixed(2)}%`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) =>
                                            typeof value === 'number'
                                                ? `${value.toFixed(2)}%`
                                                : "N/A"
                                        }
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    color: "#666",
                                }}
                            >
                                Please select a fund to view fees breakdown
                            </div>
                        )}
                    </>
                )}
            </ChartCard>
        </Container>
    );
}

export default App;
