# 📡 Latency Visualizer Dashboard

A real-time **3D latency monitoring dashboard** built with Next.js, React Three Fiber, and Chart.js.

This application provides a comprehensive visual overview of global server latency, featuring an interactive 3D Earth and detailed historical performance graphs with advanced filtering capabilities.

---

## 🚀 Features

* **🌍 3D Interactive Globe:** Displays server locations and visualizes connections using **React Three Fiber** and **Three.js**.
* **📈 Interactive Latency Graph (Chart.js):** Presents historical latency data for all monitored exchange servers.
* **🔍 Advanced Filtering:** Allows users to filter the graph by **Time Range** (1H, 24H, 7D, 30D) and **Individual Server** selection.
* **⚡ Real-time Simulation:** Designed to integrate with real-time latency data streams.
* **⚛️ Smooth UI:** Modern and responsive user interface styled with **TailwindCSS**.
* **📦 Clean Structure:** Modular and scalable application built on the **Next.js 14 App Router**.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 14** | Application structure, routing, and server-side rendering. |
| **React Three Fiber** | 3D globe rendering and integration with React components. |
| **Three.js** | Core 3D engine for rendering the interactive Earth. |
| **Chart.js** | Rendering the interactive latency line graph. |
| **TypeScript** | Type-safe coding for maintainable and robust code. |
| **TailwindCSS** | Utility-first CSS framework for rapid and consistent UI styling. |
| **date-fns** | Utility library for efficient date and time manipulation (used in filtering). |

---

## 📁 Project Structure

The project uses a standard Next.js App Router layout with clear separation for components and data.

```text
latency-visualizer
├──src/
│   ├── app/
│   │   └── page.tsx                   # Main dashboard page layout and composition
│   │
│   ├── components/
│   │   ├── ExchangeLegend.tsx         # Legend for Exchange Servers provider
│   │   ├── ExchangeMarkers.tsx        # Location of Exchange Servers
│   │   ├── Globe.tsx                  # Main file in which all components rendered
│   │   ├── HistoryGraph.tsx           # Line graph for previous latencies
│   │   ├── LatencyArc.tsx             # Connect the servers location with your location
│   │   └── UserLocationDetails.tsx    # Shows your current location
│   │
│   ├── data/
│   │   └── latencyHistory.ts          # Mock Latency Data 
│   │
│   ├── store/
│   │   ├── slices/
│   │   │     ├── latencySlice.ts      # Redux state for latencies for exchange server
│   │   │     └── userLocationSlice.ts # Redux state for user location
│   │   ├── Provider.tsx               # Provide redux state to all components 
│   │   └── store.tsx                  # Setup store for updated redux
│      
├── package.json
├── tsconfig.json
└── README.md
```
---

## ⚙️ Installation

To set up and run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/latency-visualizer.git
    cd latency-visualizer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in browser:**
    The application will be accessible at:
    [http://localhost:3000](http://localhost:3000)

---

## 📊 Latency Filters (How They Work)

The `HistoryGraph` component allows users to switch between different chronological views, filtered by both time and selected server.

| Filter | Shows Data From | Filtering Logic (Timestamp $\ge$ X) |
| :--- | :--- | :--- |
| **1 Hour** | Last 60 minutes | $\ge$ (Current Time - 1 Hour) |
| **24 Hours** | Last 24 hours | $\ge$ (Current Time - 24 Hours) |
| **7 Days** | Last 7 days | $\ge$ (Current Time - 7 Days) |
| **30 Days** | Last 30 days | $\ge$ (Current Time - 30 Days) |
| **Server Select** | Data only for the chosen exchange (e.g., Binance) or **All Servers**. |
