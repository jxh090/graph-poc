import { useState, useEffect, useMemo, useRef } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Container,
    Section,
    ButtonGroup,
    Button,
    ChartCard,
    ChartHeader,
    ChartWrapper,
    ChartButton,
    ChartButtonGroup,
    FlexBox,
    AccountLabel,
    AccountSelect,
    ToggleGrid,
    ToggleLabel,
    ToggleTrack,
} from "./App.styles";

type AccountType = "Super" | "ttr" | "pension";
type TimeRange = "1M" | "3M" | "1YR" | "3YR" | "5YR" | "10YR" | "SI";
type ViewMode = "chart" | "table";
type ChartDataPoint = Record<string, number | string>;
type ChartDataByRange = Record<TimeRange, ChartDataPoint[]>;

const TIME_RANGES: TimeRange[] = ["1M", "3M", "1YR", "3YR", "5YR", "10YR", "SI"];

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

const QUICK_TOGGLE_PORTFOLIOS: PortfolioType[] = [
    "MLC Stable *",
    "MLC Conservative Balanced **",
    "MLC Balanced",
    "MLC Growth",
    "MLC High Growth",
    "MLC Aggressive",
];

const RANGE_BUTTONS: { label: string; value: TimeRange }[] = [
    { label: "10Y", value: "10YR" },
    { label: "5Y", value: "5YR" },
    { label: "3Y", value: "3YR" },
    { label: "1Y", value: "1YR" },
    { label: "3M", value: "3M" },
    { label: "1M", value: "1M" },
];

const formatYearTick = (value: string | number) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-AU", { year: "numeric" });
};

const formatPercent = (value: number | string | readonly (number | string)[] | undefined) => {
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    return typeof normalizedValue === "number" ? `${normalizedValue.toFixed(2)}%` : "N/A";
};

const shortenPortfolioName = (portfolio: string) =>
    portfolio.replace("MLC ", "").replace(" **", "").replace(" *", "");

function App() {
    const [viewMode, setViewMode] = useState<ViewMode>("chart");
    const [accountType, setAccountType] = useState<AccountType>("Super");
    const [timeRange, setTimeRange] = useState<TimeRange>("10YR");
    const [isRangeSwitching, setIsRangeSwitching] = useState(false);
    const rangeSwitchTimerRef = useRef<number | undefined>(undefined);
    const [selectedPortfolios, setSelectedPortfolios] = useState<Set<string>>(
        new Set(["MLC High Growth"]),
    );

    const [realData, setRealData] = useState<ChartDataByRange>();

    useEffect(() => {
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
        return () => {
            if (rangeSwitchTimerRef.current !== undefined) {
                window.clearTimeout(rangeSwitchTimerRef.current);
            }
        };
    }, []);

    const data = realData?.[timeRange] ?? [];
    const portfolioColors = useMemo(() => generatePortfolioColors(), []);

    const togglePortfolio = (portfolio: string) => {
        setSelectedPortfolios((previous) => {
            const next = new Set(previous);
            if (next.has(portfolio)) {
                next.delete(portfolio);
            } else {
                next.add(portfolio);
            }
            return next;
        });
    };

    const handleTimeRangeChange = (nextRange: TimeRange) => {
        if (nextRange === timeRange) {
            return;
        }

        if (rangeSwitchTimerRef.current !== undefined) {
            window.clearTimeout(rangeSwitchTimerRef.current);
        }

        setIsRangeSwitching(true);
        setTimeRange(nextRange);

        rangeSwitchTimerRef.current = window.setTimeout(() => {
            setIsRangeSwitching(false);
        }, 220);
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
            {/* Top Controls */}
            <Section
                style={{
                    marginBottom: "24px",
                }}
            >
                <ChartButtonGroup>
                    {RANGE_BUTTONS.map((range) => (
                        <ChartButton
                            key={range.value}
                            $isActive={timeRange === range.value}
                            onClick={() => handleTimeRangeChange(range.value)}
                        >
                            {range.label}
                        </ChartButton>
                    ))}
                </ChartButtonGroup>
                <ButtonGroup>
                    {[
                        { label: "Graph", value: "chart" },
                        { label: "List", value: "table" },
                    ].map((mode) => (
                        <Button
                            key={mode.value}
                            $isActive={viewMode === mode.value}
                            onClick={() => setViewMode(mode.value as "chart" | "table")}
                        >
                            {mode.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </Section>

            {/* Integrated Chart with Controls */}
            <ChartCard>
                <div style={{ paddingBottom: '48px' }}>
                    <AccountLabel htmlFor="account-type-select">
                        Select account type
                    </AccountLabel>
                    <AccountSelect
                        id="account-type-select"
                        value={accountType}
                        onChange={(event) =>
                            setAccountType(event.target.value as AccountType)
                        }
                    >
                        <option value="Super">Super</option>
                        <option value="ttr">TTR</option>
                        <option value="pension">Pension</option>
                    </AccountSelect>
                </div>
                {viewMode === "chart" && (
                    <>
                        <ChartWrapper>
                            <ResponsiveContainer width="100%" height={480}>
                                <LineChart data={data}>
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: "#3a3a3a", fontSize: 14 }}
                                        tickMargin={12}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={formatYearTick}
                                    />
                                    <YAxis
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        domain={["auto", "auto"]}
                                        tickCount={6}
                                        tick={{ fill: "#3a3a3a", fontSize: 14 }}
                                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                                    />
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#9f9f9f"
                                        strokeOpacity={0.6}
                                    />

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
                                                isAnimationActive={!isRangeSwitching}
                                                animationBegin={0}
                                                animationDuration={650}
                                                animationEasing="ease-in-out"
                                                animateNewValues={false}
                                            />
                                        ) : null,
                                    )}

                                    <Tooltip
                                        formatter={(value) => formatPercent(value)}
                                        labelStyle={{
                                            color: "#2c3e50",
                                            fontWeight: 600,
                                        }}
                                    />
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
                                        marginBottom: "18px",
                                    }}
                                >
                                </div>
                                <ToggleGrid>
                                    {QUICK_TOGGLE_PORTFOLIOS.map((portfolio) => {
                                        const checked = selectedPortfolios.has(portfolio);
                                        return (
                                            <ToggleLabel key={portfolio}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => togglePortfolio(portfolio)}
                                                />
                                                <ToggleTrack
                                                    $checked={checked}
                                                    $color={portfolioColors[portfolio]}
                                                />
                                                <span>{shortenPortfolioName(portfolio)}</span>
                                            </ToggleLabel>
                                        );
                                    })}
                                </ToggleGrid>
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
            </ChartCard>
        </Container>
    );
}

export default App;
