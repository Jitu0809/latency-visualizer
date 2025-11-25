import React from "react";

export function ExchangeLegend({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute",
      left: 12,
      bottom: 12,
      background: "rgba(255,255,255,0.1)",
      color: "white",
      padding: "10px 12px",
      borderRadius: 8,
      fontSize: 12,
      zIndex: 20,
      backdropFilter: 'blur(10px)',
      ...style
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Server Providers</div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
        <span style={{ width: 12, height: 12, background: "#FF8C00", borderRadius: 6 }} />
        <span>AWS</span>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
        <span style={{ width: 12, height: 12, background: "#7DD3FC", borderRadius: 6 }} />
        <span>GCP</span>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ width: 12, height: 12, background: "#C084FC", borderRadius: 6 }} />
        <span>Azure</span>
      </div>
    </div>
  );
}
