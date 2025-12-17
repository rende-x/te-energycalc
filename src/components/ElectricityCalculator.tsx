import { useState, useMemo } from "react";
import { Calculator, Info, TrendingUp, TrendingDown, Percent, Wallet, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type AuctionType = "specialized" | "commercial" | "double" | "export_import";
type TradeDirection = "buy" | "sell";
type Period = "day_ahead" | "intraday" | "bilateral";

const AUCTION_TYPES = {
  specialized: { name: "Спеціалізований аукціон", commission: 0.5 },
  commercial: { name: "Комерційна секція", commission: 0.3 },
  double: { name: "Двосторонній безперервний", commission: 0.25 },
  export_import: { name: "Імпорт/Експорт", commission: 0.6 },
};

const PERIODS = {
  day_ahead: "Ринок на добу наперед",
  intraday: "Внутрішньодобовий ринок",
  bilateral: "Двосторонні договори",
};

// Guarantee deposit rates based on UEEX regulations
const GUARANTEE_RATES = {
  specialized: { buy: 15, sell: 10 },
  commercial: { buy: 12, sell: 8 },
  double: { buy: 10, sell: 5 },
  export_import: { buy: 20, sell: 15 },
};

const ElectricityCalculator = () => {
  const [volume, setVolume] = useState<number>(100);
  const [price, setPrice] = useState<number>(3500);
  const [auctionType, setAuctionType] = useState<AuctionType>("specialized");
  const [tradeDirection, setTradeDirection] = useState<TradeDirection>("sell");
  const [period, setPeriod] = useState<Period>("day_ahead");
  const [hoursCount, setHoursCount] = useState<number>(24);
  const [includeVAT, setIncludeVAT] = useState<boolean>(true);
  const [includePDV, setIncludePDV] = useState<boolean>(false);
  const [transmissionTariff, setTransmissionTariff] = useState<number>(320.55);
  const [distributionTariff, setDistributionTariff] = useState<number>(687.42);
  const [includeTransmission, setIncludeTransmission] = useState<boolean>(false);
  const [includeDistribution, setIncludeDistribution] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const totalVolume = volume * hoursCount;
    const baseAmount = totalVolume * price;
    
    // Commission
    const commissionRate = AUCTION_TYPES[auctionType].commission / 100;
    const commission = baseAmount * commissionRate;
    
    // Guarantee deposit
    const guaranteeRate = GUARANTEE_RATES[auctionType][tradeDirection] / 100;
    const guaranteeDeposit = baseAmount * guaranteeRate;
    
    // Network tariffs
    const transmissionCost = includeTransmission ? totalVolume * transmissionTariff : 0;
    const distributionCost = includeDistribution ? totalVolume * distributionTariff : 0;
    
    // VAT (20%)
    const vatRate = includeVAT ? 0.20 : 0;
    const vatAmount = (baseAmount + commission + transmissionCost + distributionCost) * vatRate;
    
    // PDV special regime for electricity
    const pdvAmount = includePDV ? baseAmount * 0.07 : 0;
    
    // Total calculations
    let totalAmount: number;
    if (tradeDirection === "sell") {
      totalAmount = baseAmount - commission - vatAmount - pdvAmount;
    } else {
      totalAmount = baseAmount + commission + transmissionCost + distributionCost + vatAmount + pdvAmount;
    }
    
    const pricePerMWh = totalVolume > 0 ? totalAmount / totalVolume : 0;
    
    return {
      totalVolume,
      baseAmount,
      commission,
      commissionRate: AUCTION_TYPES[auctionType].commission,
      guaranteeDeposit,
      guaranteeRate: GUARANTEE_RATES[auctionType][tradeDirection],
      transmissionCost,
      distributionCost,
      vatAmount,
      pdvAmount,
      totalAmount,
      pricePerMWh,
    };
  }, [volume, price, auctionType, tradeDirection, hoursCount, includeVAT, includePDV, transmissionTariff, distributionTariff, includeTransmission, includeDistribution]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <section id="calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Калькулятор</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Розрахунок вартості електроенергії
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Враховує комісію біржі, гарантійний внесок, мережеві тарифи та податки 
            відповідно до чинного законодавства України
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Input Parameters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trade Direction */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {tradeDirection === "sell" ? (
                    <TrendingUp className="w-5 h-5 text-energy-green" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-energy-blue" />
                  )}
                  Напрямок операції
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTradeDirection("sell")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      tradeDirection === "sell"
                        ? "border-energy-green bg-energy-green/10 text-foreground"
                        : "border-border hover:border-energy-green/50"
                    }`}
                  >
                    <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${tradeDirection === "sell" ? "text-energy-green" : "text-muted-foreground"}`} />
                    <div className="font-semibold">Продаж</div>
                    <div className="text-sm text-muted-foreground">Виробник / Трейдер</div>
                  </button>
                  <button
                    onClick={() => setTradeDirection("buy")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      tradeDirection === "buy"
                        ? "border-energy-blue bg-energy-blue/10 text-foreground"
                        : "border-border hover:border-energy-blue/50"
                    }`}
                  >
                    <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${tradeDirection === "buy" ? "text-energy-blue" : "text-muted-foreground"}`} />
                    <div className="font-semibold">Купівля</div>
                    <div className="text-sm text-muted-foreground">Споживач / Постачальник</div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Main Parameters */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-energy-yellow" />
                  Основні параметри
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="volume" className="flex items-center gap-2">
                      Обсяг електроенергії (МВт)
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Потужність за годину. Загальний обсяг = МВт × кількість годин</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="volume"
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      min={0}
                      step={1}
                      className="text-lg font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      Ціна (грн/МВт·год)
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Біржова ціна за 1 МВт·год електроенергії</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min={0}
                      step={100}
                      className="text-lg font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Кількість годин постачання: <span className="font-bold text-primary">{hoursCount}</span>
                  </Label>
                  <Slider
                    value={[hoursCount]}
                    onValueChange={(value) => setHoursCount(value[0])}
                    min={1}
                    max={744}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 год</span>
                    <span>24 год (доба)</span>
                    <span>168 год (тиждень)</span>
                    <span>744 год (місяць)</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Тип аукціону</Label>
                    <Select value={auctionType} onValueChange={(v) => setAuctionType(v as AuctionType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(AUCTION_TYPES).map(([key, { name, commission }]) => (
                          <SelectItem key={key} value={key}>
                            {name} ({commission}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ринковий сегмент</Label>
                    <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PERIODS).map(([key, name]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Tariffs */}
            {tradeDirection === "buy" && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-energy-cyan" />
                    Мережеві тарифи
                  </CardTitle>
                  <CardDescription>
                    Тарифи на передачу та розподіл електроенергії (для покупців)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <Label>Передача електроенергії (ОСП)</Label>
                      <div className="text-sm text-muted-foreground">Тариф: {transmissionTariff.toFixed(2)} грн/МВт·год</div>
                    </div>
                    <Switch
                      checked={includeTransmission}
                      onCheckedChange={setIncludeTransmission}
                    />
                  </div>

                  {includeTransmission && (
                    <div className="pl-4">
                      <Input
                        type="number"
                        value={transmissionTariff}
                        onChange={(e) => setTransmissionTariff(Number(e.target.value))}
                        step={0.01}
                        className="max-w-xs"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <Label>Розподіл електроенергії (ОСР)</Label>
                      <div className="text-sm text-muted-foreground">Тариф: {distributionTariff.toFixed(2)} грн/МВт·год</div>
                    </div>
                    <Switch
                      checked={includeDistribution}
                      onCheckedChange={setIncludeDistribution}
                    />
                  </div>

                  {includeDistribution && (
                    <div className="pl-4">
                      <Input
                        type="number"
                        value={distributionTariff}
                        onChange={(e) => setDistributionTariff(Number(e.target.value))}
                        step={0.01}
                        className="max-w-xs"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tax Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-energy-yellow" />
                  Податки та збори
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <Label>ПДВ (20%)</Label>
                    <div className="text-sm text-muted-foreground">Податок на додану вартість</div>
                  </div>
                  <Switch
                    checked={includeVAT}
                    onCheckedChange={setIncludeVAT}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <Label>Спеціальний режим ПДВ (7%)</Label>
                    <div className="text-sm text-muted-foreground">Для виробників електроенергії з ВДЕ</div>
                  </div>
                  <Switch
                    checked={includePDV}
                    onCheckedChange={setIncludePDV}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Результати розрахунку
                  </CardTitle>
                  <CardDescription>
                    {tradeDirection === "sell" ? "Виручка від продажу" : "Витрати на купівлю"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Total Amount */}
                  <div className={`p-6 rounded-xl ${tradeDirection === "sell" ? "bg-energy-green/10 border border-energy-green/30" : "bg-energy-blue/10 border border-energy-blue/30"}`}>
                    <div className="text-sm text-muted-foreground mb-1">
                      {tradeDirection === "sell" ? "Чистий дохід" : "Загальні витрати"}
                    </div>
                    <div className={`text-3xl font-bold ${tradeDirection === "sell" ? "text-energy-green" : "text-energy-blue"}`}>
                      {formatCurrency(calculations.totalAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {formatCurrency(calculations.pricePerMWh)}/МВт·год
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Загальний обсяг</span>
                      <span className="font-mono font-medium">{calculations.totalVolume.toLocaleString("uk-UA")} МВт·год</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Базова вартість</span>
                      <span className="font-mono font-medium">{formatCurrency(calculations.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Комісія біржі ({calculations.commissionRate}%)
                      </span>
                      <span className="font-mono font-medium text-destructive">
                        -{formatCurrency(calculations.commission)}
                      </span>
                    </div>
                    
                    {calculations.transmissionCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Передача (ОСП)</span>
                        <span className="font-mono font-medium">{formatCurrency(calculations.transmissionCost)}</span>
                      </div>
                    )}
                    
                    {calculations.distributionCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Розподіл (ОСР)</span>
                        <span className="font-mono font-medium">{formatCurrency(calculations.distributionCost)}</span>
                      </div>
                    )}

                    {calculations.vatAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ПДВ (20%)</span>
                        <span className="font-mono font-medium">{formatCurrency(calculations.vatAmount)}</span>
                      </div>
                    )}

                    {calculations.pdvAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Спец. режим ПДВ (7%)</span>
                        <span className="font-mono font-medium">{formatCurrency(calculations.pdvAmount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Guarantee Deposit */}
                  <div className="mt-6 p-4 rounded-lg bg-energy-yellow/10 border border-energy-yellow/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-4 h-4 text-energy-yellow" />
                      <span className="font-medium text-sm">Гарантійний внесок</span>
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {formatCurrency(calculations.guaranteeDeposit)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {calculations.guaranteeRate}% від суми угоди
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>
                      <strong>Тип аукціону:</strong> {AUCTION_TYPES[auctionType].name}
                    </p>
                    <p>
                      <strong>Ринок:</strong> {PERIODS[period]}
                    </p>
                    <p>
                      <strong>Період:</strong> {hoursCount} год ({(hoursCount / 24).toFixed(1)} діб)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectricityCalculator;
