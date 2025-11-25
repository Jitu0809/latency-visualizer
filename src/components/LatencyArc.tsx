import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { createRef } from "react";
import { useFrame } from "@react-three/fiber";

interface LatencyArcProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color?: string;
  speed?: number;
}

export default function LatencyArc({
  start,
  end,
  color = "#00ffff",
  speed = 0.15,
}: LatencyArcProps) {

  const curve = useMemo(() => {
    const mid = start.clone().lerp(end, 0.5);
    mid.normalize().multiplyScalar(2.3); 
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(100), [curve]);

  const particleRefs = useRef([
    {
        t: 0,                             
        speedOffset: 1,                   
        ref: createRef<THREE.Mesh>(),
    },
  ]);

  useFrame((_, delta) => {
    particleRefs.current.forEach((p) => {
      p.t += delta * speed * p.speedOffset;
      if (p.t > 1) p.t = 0;

      let pos = curve.getPoint(p.t);

      const lift = pos.clone().normalize().multiplyScalar(0.015);
      pos.add(lift);

      if (p.ref.current) {
        p.ref.current.position.copy(pos);
      }
    });
  });

  return (
    <>
      <Line
        points={points}
        color={color}
        lineWidth={2}
        dashed
        dashSize={0.015}
        gapSize={0.015}
        transparent
        opacity={0.8}
      />

      {particleRefs.current.map((p, i) => (
        <mesh key={i} ref={p.ref}>
          <sphereGeometry args={[0.008, 12, 12]} />
          <meshPhongMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
            shininess={100}
          />
        </mesh>
      ))}
    </>
  );
}
