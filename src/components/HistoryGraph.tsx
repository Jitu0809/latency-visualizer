import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartData,
    ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { latencyHistory } from '@/src/data/latencyHistory';
import { sub, getTime } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);


const ALL_SERVERS_KEY = 'ALL'; 

const TIME_RANGES = [
    { label: '1 Hr', value: '1hr', subFunction: () => sub(new Date(), { hours: 1 }) },
    { label: '24 Hrs', value: '24hrs', subFunction: () => sub(new Date(), { hours: 24 }) },
    { label: '7 Days', value: '7days', subFunction: () => sub(new Date(), { days: 7 }) },
    { label: '30 Days', value: '30days', subFunction: () => sub(new Date(), { days: 30 }) },
];

interface LatencyDataPoint {
    server: string;
    timestamp: string;
    latency_ms: number;
}
type HistoryChartData = ChartData<'line', { x: string; y: number }[]>;

const CHART_COLORS = [
    '#FF4500', 
    '#1E90FF', 
    '#32CD32', 
    '#8A2BE2', 
];

const getServerNames = (): string[] => {
    return Array.from(new Set(latencyHistory.map(item => item.server)));
};


const useChartData = (selectedRange: string, selectedServer: string): HistoryChartData => {
    const filterConfig = TIME_RANGES.find(range => range.value === selectedRange);
    const minTimestamp = filterConfig ? getTime(filterConfig.subFunction()) : 0;
    
    const processedData = useMemo(() => {
        let filteredLatencyData = latencyHistory.filter(item => {
            const itemTimestamp = getTime(new Date(item.timestamp));
            return itemTimestamp >= minTimestamp;
        });

        if (selectedServer !== ALL_SERVERS_KEY) {
            filteredLatencyData = filteredLatencyData.filter(item => item.server === selectedServer);
        }

        const groupedData = filteredLatencyData.reduce((acc, current) => {
            if (!acc[current.server]) {
                acc[current.server] = [];
            }
            acc[current.server].push(current);
            return acc;
        }, {} as Record<string, LatencyDataPoint[]>);

        const serverNames = Object.keys(groupedData);

        const datasets = serverNames.map((server, index) => {
            const sortedData = groupedData[server].sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            const dataPoints = sortedData.map(item => ({
                x: item.timestamp,
                y: item.latency_ms,
            }));
            
            const globalIndex = getServerNames().indexOf(server);
            const color = CHART_COLORS[globalIndex % CHART_COLORS.length];

            return {
                label: server,
                data: dataPoints,
                borderColor: color,
                backgroundColor: color,
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.1,
            };
        });

        if (filteredLatencyData.length === 0) {
            console.warn("Data is EMPTY! Chart will not render.");
            return { datasets: [] };
        }

        return { datasets };
    }, [minTimestamp, selectedServer]); 

    return processedData;
};

const getChartOptions = (selectedRange: string, selectedServer: string): ChartOptions<'line'> => {
    
    type ChartTimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month'; 
    
    let timeUnit: ChartTimeUnit = 'hour';
    let tooltipFormat = 'MMM d, HH:mm';
    
    if (selectedRange === '7days' || selectedRange === '30days') {
        timeUnit = 'day';
        tooltipFormat = 'MMM d, HH:mm';
    } else if (selectedRange === '1hr') {
        timeUnit = 'minute'; 
        tooltipFormat = 'HH:mm:ss';
    }

    const serverDisplay = selectedServer === ALL_SERVERS_KEY ? 'All Servers' : selectedServer;
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: selectedServer === ALL_SERVERS_KEY, 
                position: 'top' as const,
                labels: { color: 'white', boxWidth: 10, padding: 15 }
            },
            title: {
                display: true,
                text: `${serverDisplay} Latency (ms) - Last ${TIME_RANGES.find(r => r.value === selectedRange)?.label}`,
                color: 'white',
                font: { size: 16 }
            },
            tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: timeUnit, 
                    tooltipFormat: tooltipFormat,
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                        day: 'MMM d',
                        month: 'MMM yyyy'
                    }
                },
                title: { display: true, text: 'Time (UTC)', color: 'white' },
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                title: { display: true, text: 'Latency (ms)', color: 'white' },
                ticks: { color: 'white' },
                min: 0,
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
        },
    };
};

export default function HistoryGraph() {
  const [selectedRange, setSelectedRange] = useState<string>('30days'); 
  const [selectedServer, setSelectedServer] = useState<string>(ALL_SERVERS_KEY);

  const availableServers = useMemo(() => getServerNames(), []);

  const data = useChartData(selectedRange, selectedServer);
  
  const chartOptions = getChartOptions(selectedRange, selectedServer);

  const hasData = data.datasets.some(dataset => dataset.data.length > 0);

  return (
    <div 
      style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        width: 400, 
        height: 400,
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        padding: "10px 12px",
        borderRadius: 8,
        fontSize: 14,
        zIndex: 20,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div 
        style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '10px', 
            gap: '10px' 
        }}
      >
        <select
          value={selectedServer}
          onChange={(e) => setSelectedServer(e.target.value)}
          style={{
            padding: '4px 8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            minWidth: '100px', 
          }}
        >
          <option value={ALL_SERVERS_KEY}>All Servers</option>
          {availableServers.map((server) => (
            <option key={server} value={server}>{server}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '5px' }}>
            {TIME_RANGES.map((range) => (
            <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                style={{
                padding: '4px 8px',
                border: `1px solid ${selectedRange === range.value ? '#32CD32' : 'rgba(255, 255, 255, 0.3)'}`,
                background: selectedRange === range.value ? 'rgba(50, 205, 50, 0.2)' : 'transparent',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.1s ease',
                }}
            >
                {range.label}
            </button>
            ))}
        </div>
      </div>
      
      <div style={{ flexGrow: 1, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {hasData ? (
            <Line options={chartOptions} data={data} />
        ) : (
             <p style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                No latency data found for **{selectedServer}** in the last **{TIME_RANGES.find(r => r.value === selectedRange)?.label}**.
            </p>
        )}
      </div>

    </div>
  );
}