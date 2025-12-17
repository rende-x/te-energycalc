import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";

type PeriodType = "day" | "week" | "month" | "quarter";

// Generate realistic mock price data for UEEX
const generatePriceData = (period: PeriodType) => {
  const now = new Date();
  const data: Array<{
    date: string;
    fullDate: string;
    dayAhead: number;
    intraday: number;
    bilateral: number;
  }> = [];

  let points: number;
  let dateFormat: (date: Date) => string;
  let fullDateFormat: (date: Date) => string;

  switch (period) {
    case "day":
      points = 24;
      dateFormat = (d) => `${d.getHours().toString().padStart(2, "0")}:00`;
      fullDateFormat = (d) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
      break;
    case "week":
      points = 7;
      dateFormat = (d) => d.toLocaleDateString("uk-UA", { weekday: "short" });
      fullDateFormat = (d) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
      break;
    case "month":
      points = 30;
      dateFormat = (d) => d.getDate().toString();
      fullDateFormat = (d) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
      break;
    case "quarter":
      points = 90;
      dateFormat = (d) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
      fullDateFormat = (d) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
      break;
  }

  // Base prices around typical Ukrainian market values (грн/МВт·год)
  let baseDayAhead = 3200 + Math.random() * 600;
  let baseIntraday = 3400 + Math.random() * 500;
  let baseBilateral = 3000 + Math.random() * 400;

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now);
    
    if (period === "day") {
      date.setHours(date.getHours() - i);
    } else {
      date.setDate(date.getDate() - i);
    }

    // Add realistic price volatility
    const volatility = period === "day" ? 0.05 : 0.08;
    const trend = Math.sin(i / (points / 3)) * 200;
    
    baseDayAhead += (Math.random() - 0.5) * baseDayAhead * volatility;
    baseIntraday += (Math.random() - 0.5) * baseIntraday * volatility;
    baseBilateral += (Math.random() - 0.5) * baseBilateral * volatility;

    // Peak hours simulation for day view
    let peakMultiplier = 1;
    if (period === "day") {
      const hour = date.getHours();
      if (hour >= 8 && hour <= 11) peakMultiplier = 1.15;
      if (hour >= 18 && hour <= 21) peakMultiplier = 1.25;
      if (hour >= 0 && hour <= 5) peakMultiplier = 0.85;
    }

    data.push({
      date: dateFormat(date),
      fullDate: fullDateFormat(date),
      dayAhead: Math.round((baseDayAhead + trend) * peakMultiplier),
      intraday: Math.round((baseIntraday + trend * 1.1) * peakMultiplier),
      bilateral: Math.round(baseBilateral + trend * 0.5),
    });
  }

  return data;
};

const periods: { value: PeriodType; label: string }[] = [
  { value: "day", label: "Доба" },
  { value: "week", label: "Тиждень" },
  { value: "month", label: "Місяць" },
  { value: "quarter", label: "Квартал" },
];

const PriceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month");
  const [activeMarket, setActiveMarket] = useState<"all" | "dayAhead" | "intraday" | "bilateral">("all");

  const data = useMemo(() => generatePriceData(selectedPeriod), [selectedPeriod]);

  const stats = useMemo(() => {
    const dayAheadPrices = data.map((d) => d.dayAhead);
    const intradayPrices = data.map((d) => d.intraday);
    const bilateralPrices = data.map((d) => d.bilateral);

    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    const min = (arr: number[]) => Math.min(...arr);
    const max = (arr: number[]) => Math.max(...arr);

    const firstDayAhead = dayAheadPrices[0];
    const lastDayAhead = dayAheadPrices[dayAheadPrices.length - 1];
    const change = ((lastDayAhead - firstDayAhead) / firstDayAhead) * 100;

    return {
      dayAhead: { avg: avg(dayAheadPrices), min: min(dayAheadPrices), max: max(dayAheadPrices) },
      intraday: { avg: avg(intradayPrices), min: min(intradayPrices), max: max(intradayPrices) },
      bilateral: { avg: avg(bilateralPrices), min: min(bilateralPrices), max: max(bilateralPrices) },
      change,
      lastPrice: lastDayAhead,
    };
  }, [data]);

  const formatPrice = (value: number) => `${value.toLocaleString("uk-UA")} грн`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-4">
          <p className="font-semibold text-foreground mb-2">{item?.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono font-medium">{formatPrice(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="prices" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Аналітика</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Динаміка цін на електроенергію
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Історичні дані цін на ринках електроенергії України (демонстраційні дані)
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedPeriod === period.value
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Calendar className="w-4 h-4 inline-block mr-2" />
              {period.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-energy-blue/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Поточна ціна (РДН)</div>
              <div className="text-2xl font-bold text-foreground">{formatPrice(stats.lastPrice)}</div>
              <div className={`flex items-center gap-1 text-sm mt-1 ${stats.change >= 0 ? "text-energy-green" : "text-destructive"}`}>
                {stats.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stats.change >= 0 ? "+" : ""}{stats.change.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
          <Card className="border-energy-cyan/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Середня (РДН)</div>
              <div className="text-2xl font-bold text-foreground">{formatPrice(stats.dayAhead.avg)}</div>
              <div className="text-xs text-muted-foreground mt-1">за обраний період</div>
            </CardContent>
          </Card>
          <Card className="border-energy-green/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Мінімум</div>
              <div className="text-2xl font-bold text-energy-green">{formatPrice(stats.dayAhead.min)}</div>
              <div className="text-xs text-muted-foreground mt-1">МВт·год</div>
            </CardContent>
          </Card>
          <Card className="border-energy-yellow/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Максимум</div>
              <div className="text-2xl font-bold text-energy-yellow">{formatPrice(stats.dayAhead.max)}</div>
              <div className="text-xs text-muted-foreground mt-1">МВт·год</div>
            </CardContent>
          </Card>
        </div>

        {/* Market Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveMarket("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMarket === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Всі ринки
          </button>
          <button
            onClick={() => setActiveMarket("dayAhead")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMarket === "dayAhead" ? "bg-energy-blue text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            РДН
          </button>
          <button
            onClick={() => setActiveMarket("intraday")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMarket === "intraday" ? "bg-energy-cyan text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            ВДР
          </button>
          <button
            onClick={() => setActiveMarket("bilateral")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeMarket === "bilateral" ? "bg-energy-green text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Двосторонні
          </button>
        </div>

        {/* Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Ціни на електроенергію (грн/МВт·год)</CardTitle>
            <CardDescription>
              РДН - Ринок на добу наперед, ВДР - Внутрішньодобовий ринок
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDayAhead" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200, 100%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(200, 100%, 40%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorIntraday" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(185, 80%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(185, 80%, 45%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBilateral" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(165, 80%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(165, 80%, 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                    domain={["dataMin - 200", "dataMax + 200"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="circle"
                  />
                  {(activeMarket === "all" || activeMarket === "dayAhead") && (
                    <Area
                      type="monotone"
                      dataKey="dayAhead"
                      name="Ринок на добу наперед"
                      stroke="hsl(200, 100%, 40%)"
                      fillOpacity={1}
                      fill="url(#colorDayAhead)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, stroke: "hsl(200, 100%, 40%)", strokeWidth: 2 }}
                    />
                  )}
                  {(activeMarket === "all" || activeMarket === "intraday") && (
                    <Area
                      type="monotone"
                      dataKey="intraday"
                      name="Внутрішньодобовий ринок"
                      stroke="hsl(185, 80%, 45%)"
                      fillOpacity={1}
                      fill="url(#colorIntraday)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, stroke: "hsl(185, 80%, 45%)", strokeWidth: 2 }}
                    />
                  )}
                  {(activeMarket === "all" || activeMarket === "bilateral") && (
                    <Area
                      type="monotone"
                      dataKey="bilateral"
                      name="Двосторонні договори"
                      stroke="hsl(165, 80%, 40%)"
                      fillOpacity={1}
                      fill="url(#colorBilateral)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, stroke: "hsl(165, 80%, 40%)", strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Legend */}
        <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-border">
          <h4 className="font-semibold text-foreground mb-4">Сегменти ринку електроенергії</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-energy-blue mt-1 shrink-0" />
              <div>
                <div className="font-medium text-foreground">РДН (Ринок на добу наперед)</div>
                <div className="text-muted-foreground">Торги на наступну добу. Заявки до 12:00.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-energy-cyan mt-1 shrink-0" />
              <div>
                <div className="font-medium text-foreground">ВДР (Внутрішньодобовий)</div>
                <div className="text-muted-foreground">Коригування позицій протягом доби постачання.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-energy-green mt-1 shrink-0" />
              <div>
                <div className="font-medium text-foreground">Двосторонні договори</div>
                <div className="text-muted-foreground">Довгострокові контракти між учасниками.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceChart;
