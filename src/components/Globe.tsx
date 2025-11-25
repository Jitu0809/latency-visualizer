"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import LatencyArc from "@/src/components/LatencyArc";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { latLonToXYZ } from "@/src/utils/latLonToXYZ";
import { ExchangeLegend } from "./ExchangeLegend";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import ExchangeMarkers from "./ExchangeMarkers";
import { UserLocationDetails } from "./UserLocationDetails";
import HistoryGraph from "./HistoryGraph";


function LatencyArcs() {
  const userLocation = useSelector((state: RootState) => state.userLocation);
  const servers = useSelector((state: RootState) => state.latency);

  return (
    <>
      {servers.data.map((entry, idx) => {
        const startXYZ = latLonToXYZ(userLocation.latitude ?? 0, userLocation.longitude ?? 0, 1.55);
        const endXYZ   = latLonToXYZ(entry.location.lat, entry.location.lon, 1.55);
        const latency = entry.latency_ms ?? 9999;

        const color =
          latency < 200 ? "#00ff00" :
          latency < 400 ? "yellow" :
          "red";

        return (
          <LatencyArc
            key={idx}
            start={startXYZ}
            end={endXYZ}
            color={color}
            speed={0.4}
        />
        );
      })}
    </>
  );
}


function Earth() {
  const earthTexture = useTexture("/textures/earth.jpg");

  return (
    <Sphere args={[1.5, 64, 64]}>
      <meshStandardMaterial map={earthTexture} />
    </Sphere>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 3] }} gl={{ toneMappingExposure: 0.8 }}>
        <ambientLight intensity={1} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        <Earth />
        <ExchangeMarkers />
        <LatencyArcs />
        <OrbitControls enableZoom enablePan={false} />
        <EffectComposer>
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.9}
              intensity={1.5}
            />
        </EffectComposer>
      </Canvas>
      <UserLocationDetails />
      <ExchangeLegend />
      <HistoryGraph />
    </div>
  );
}
