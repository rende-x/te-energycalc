import { useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, BarChart3, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useUEEXPrices } from "@/hooks/useUEEXPrices";
import { Button } from "@/components/ui/button";

type PeriodType = "day" | "week" | "month" | "quarter";

const periods: { value: PeriodType; label: string }[] = [
  { value: "day", label: "Доба" },
  { value: "week", label: "Тиждень" },
  { value: "month", label: "Місяць" },
  { value: "quarter", label: "Квартал" },
];

const PriceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month");
  const [activeMarket, setActiveMarket] = useState<"all" | "dayAhead" | "intraday" | "bilateral">("all");

  const { data, stats, loading, error, lastUpdated, refetch } = useUEEXPrices(selectedPeriod);

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

  // Loading state
  if (loading) {
    return (
      <section id="prices" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Завантаження даних з УЕЕХ...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="prices" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Спробувати знову
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="prices" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Аналітика УЕЕХ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Динаміка цін на електроенергію
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Дані цін на ринках електроенергії України з Української енергетичної біржі
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-2">
              Оновлено: {new Date(lastUpdated).toLocaleString("uk-UA")}
            </p>
          )}
        </div>

        {/* Period Selector with Refresh */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
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
          <Button onClick={refetch} variant="outline" size="sm" className="ml-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
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
                <div className="text-2xl font-bold text-foreground">{formatPrice(stats.average)}</div>
                <div className="text-xs text-muted-foreground mt-1">за обраний період</div>
              </CardContent>
            </Card>
            <Card className="border-energy-green/20">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Мінімум</div>
                <div className="text-2xl font-bold text-energy-green">{formatPrice(stats.min)}</div>
                <div className="text-xs text-muted-foreground mt-1">МВт·год</div>
              </CardContent>
            </Card>
            <Card className="border-energy-yellow/20">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Максимум</div>
                <div className="text-2xl font-bold text-energy-yellow">{formatPrice(stats.max)}</div>
                <div className="text-xs text-muted-foreground mt-1">МВт·год</div>
              </CardContent>
            </Card>
          </div>
        )}

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
                    dataKey="displayDate"
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
