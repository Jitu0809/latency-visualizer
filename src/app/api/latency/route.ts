import { NextResponse } from "next/server";

const SERVERS = [
  {
    name: "Binance",
    api: "https://api.binance.com/api/v3/time",
    server: "api.binance.com",
    location: { city: "Tokyo", country: "Japan", lat: 35.6895, lon: 139.6917 },
    provider: "AWS",
  },
  {
    name: "Bybit",
    api: "https://api.bybit.com/v5/market/time",
    server: "api.bybit.com",
    location: { city: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
    provider: "Azure",
  },
  {
    name: "OKX",
    api: "https://www.okx.com/api/v5/public/time",
    server: "www.okx.com",
    location: { city: "Hong Kong", country: "China", lat: 22.3193, lon: 114.1694 },
    provider: "AWS",
  },
  {
    name: "Deribit",
    api: "https://www.deribit.com/api/v2/public/get_time",
    server: "www.deribit.com",
    location: { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
    provider: "GCP",
  },
  {
    name: "Kraken",
    api: "https://api.kraken.com/0/public/Time",
    server: "api.kraken.com",
    location: { city: "Seattle", country: "USA", lat: 47.6062, lon: -122.3321 },
    provider: "AWS",
  },
];

export async function GET() {
  const results = await Promise.all(
    SERVERS.map(async (s) => {
      const start = performance.now();

      try {
        await fetch(s.api, { cache: "no-store" });
        const end = performance.now();

        return {
          name: s.name,
          host: s.server,
          latency_ms: Math.round(end - start),
          provider: s.provider,
          location: s.location,
        };
      } catch {
        return {
          name: s.name,
          host: s.server,
          latency_ms: null,
          provider: s.provider,
          location: s.location,
        };
      }
    })
  );

  return NextResponse.json(results);
}
