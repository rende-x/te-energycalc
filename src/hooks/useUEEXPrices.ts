import { useState, useEffect, useCallback } from "react";

export interface PriceDataPoint {
  date: string;
  dayAhead: number;
  intraday: number;
  bilateral: number;
}

export interface PriceStats {
  average: number;
  min: number;
  max: number;
  lastPrice: number;
  change: number;
}

export interface UEEXPricesResponse {
  data: PriceDataPoint[];
  stats: PriceStats;
  source: string;
  lastUpdated: string;
}

type PeriodType = "day" | "week" | "month" | "quarter";

export function useUEEXPrices(period: PeriodType) {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch directly from edge function with query params
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ueex-prices?period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.status}`);
      }

      const result: UEEXPricesResponse = await response.json();

      // Format dates for display based on period
      const formattedData = result.data.map((item) => {
        const date = new Date(item.date);
        let formattedDate: string;
        let fullDate: string;

        switch (period) {
          case "day":
            formattedDate = date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
            fullDate = date.toLocaleDateString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
            break;
          case "week":
            formattedDate = date.toLocaleDateString("uk-UA", { weekday: "short" });
            fullDate = date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
            break;
          case "month":
            formattedDate = date.getDate().toString();
            fullDate = date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
            break;
          case "quarter":
            formattedDate = date.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
            fullDate = date.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
            break;
        }

        return {
          ...item,
          displayDate: formattedDate,
          fullDate,
        };
      });

      setData(formattedData);
      setStats(result.stats);
      setLastUpdated(result.lastUpdated);
    } catch (err) {
      console.error("Error fetching UEEX prices:", err);
      setError(err instanceof Error ? err.message : "Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    data,
    stats,
    loading,
    error,
    lastUpdated,
    refetch: fetchPrices,
  };
}
