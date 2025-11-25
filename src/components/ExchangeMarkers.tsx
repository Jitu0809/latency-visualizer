// components/map/ExchangeMarkers.tsx
"use client";

import { useState, useMemo } from "react";
import { Html } from "@react-three/drei";
// import { latLonToXYZ } from "@/utils/latLonToXYZ";
import { useSelector } from "react-redux";
import { latLonToXYZ } from "@/src/utils/latLonToXYZ";
import { LatencyEntry } from "@/src/store/slices/latencySlice";
import { RootState } from "@/src/store/store";
// import { RootState } from "@/store/store";
// import { LatencyEntry } from "@/store/slices/latencySlice";



type Props = {
  globeRadius?: number;
  markerSize?: number;
  onSelect?: (loc: LatencyEntry) => void;
};

export default function ExchangeMarkers({
  globeRadius = 1.55,
  markerSize = 0.02,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const userLocation = useSelector((state: RootState) => state.userLocation);
  const servers = useSelector((state: RootState) => state.latency);

  const items = useMemo(() => {
    return servers.data.map((ex) => {
      const pos = latLonToXYZ(ex.location.lat, ex.location.lon, globeRadius);
      const color =
        ex.provider === "AWS" ? "#FF8C00" :
        ex.provider === "GCP" ? "#7DD3FC" :
        "#C084FC";
      return { ex, pos, color };
    });
  }, [servers.data, globeRadius]);

  return (
    <>
      {(() => {
        const pos = latLonToXYZ(userLocation.latitude ?? 0, userLocation.longitude ?? 0, 1.55);

        return (
          <mesh
            position={[pos.x, pos.y, pos.z]}
            onPointerEnter={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
              setHovered(userLocation.city);
            }}
            onPointerLeave={() => {
              document.body.style.cursor = "default";
              setHovered(null)
            }}
          >
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />

            {hovered === userLocation.city && (
              <Html occlude={false} center>
                <div style={{
                  background: "rgba(0,0,0,0.75)",
                  color: "white",
                  padding: "6px 8px",
                  borderRadius: 6,
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  position: "absolute",
                  top: 2,
                  left: 2,
                }}>
                  <div style={{ fontWeight: 700 }}>{userLocation.city}</div>
                </div>
              </Html>
            )}
          </mesh>
        );
      })()}


      {items.map(({ ex, pos, color }) => (
        <mesh
          key={ex.name}
          position={[pos.x, pos.y, pos.z]}
          onPointerEnter={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            setHovered(ex.name);
          }}
          onPointerLeave={() => {
            document.body.style.cursor = "default";
            setHovered(null)
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelected(ex.name);
            onSelect?.(ex);
          }}
        >
          {/* marker: slightly face the camera? use small sphere */}
          <sphereGeometry args={[markerSize, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />

          {/* tooltip shown on hover (Html positions itself in screen space) */}
          {hovered === ex.name && (
            <Html occlude={false} center>
              <div style={{
                background: "rgba(0,0,0,0.75)",
                color: "white",
                padding: "6px 8px",
                borderRadius: 6,
                fontSize: 12,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                position: "absolute",
                top: 2,
                left: 2,
              }}>
                <div style={{ fontWeight: 700 }}>{ex.name}</div>
                <div style={{ fontSize: 11 }}>{ex.provider}</div>
              </div>
            </Html>
          )}
        </mesh>
      ))}
      
      <Html fullscreen className="pointer-events-none">
        <div style={{
            position: "absolute",
            right: 12,
            top: 12,
            background: "rgba(255,255,255,0.1)",
            color: "white",
            padding: 12,
            borderRadius: 8,
            width: 200,
            zIndex: 20,
            backdropFilter: 'blur(10px)'
          }}>
            {items.map(({ ex, pos, color}) => {
              const latency = ex.latency_ms ?? 9999;
              const latencyColor = latency<200?"#00ff00":latency<400?'yellow':'red';

              return <div key={ex.name} style={{ color: latencyColor }}>
                <div className="flex justify-between"> 
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-black" style={{ background: latencyColor }}></div>
                    <p style={{ color: '#ffffff' }}>{ex.name}</p>
                  </div>
                  <p>{ex.latency_ms} ms</p>
                </div>
              </div>
            })}
          </div>
      </Html>

      {/* A small info panel in 3D screen space when clicked */}
      {selected && (() => {
        const sel = servers.data?.find((l) => l.name === selected);
        const latency = sel?.latency_ms ?? 9999;
        const latencyColor = latency<200?"#00ff00":latency<400?'yellow':'red';

        if (!sel) return null;
        return (
          <Html fullscreen className="pointer-events-none">
            <div style={{
              position: "absolute",
              // right: 224,
              // top: 12,
              top: "50%",
              left: 12,
              background: "rgba(255,255,255,0.1)",
              color: "white",
              padding: 12,
              borderRadius: 8,
              minWidth: 250,
              zIndex: 20,
              transform: "translateY(-50%)",
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{fontSize: 24, color: latencyColor}}>{sel.name}</strong>
                {/* <button style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  fontWeight: "bolder"
                }} onClick={() => setSelected(null)}><i className="fa-solid fa-xmark"></i></button> */}
              </div>
              <div>
                <div><strong>Provider:</strong> {sel.provider}</div>
                <p>Latency: {sel.latency_ms}</p>
                <p>Location: {sel.location.city}, {sel.location.country}</p>
                <p>Host: {sel.host}</p>
                <p>Lat: {sel.location.lat.toFixed(4)}, Lon: {sel.location.lon.toFixed(4)}</p>
              </div>
            </div>
          </Html>
        );
      })()}
    </>
  );
}
