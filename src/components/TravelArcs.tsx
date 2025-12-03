import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { races2024 } from "../data/races";
import { latLngToVector3 } from "./RaceMarker";

interface TravelArcsProps {
  radius: number;
}

interface ArrowHeadProps {
  position: THREE.Vector3;
  direction: THREE.Vector3;
}

function createArcPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  segments: number = 50
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  
  const startNorm = start.clone().normalize();
  const endNorm = end.clone().normalize();
  const angle = startNorm.angleTo(endNorm);
  
  const arcHeight = Math.min(angle * 0.3, 0.4);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    point.normalize();
    
    const heightMultiplier = 1 + arcHeight * Math.sin(t * Math.PI);
    point.multiplyScalar(radius * heightMultiplier);
    
    points.push(point);
  }

  return points;
}

function ArrowHead({ position, direction }: ArrowHeadProps) {
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    return q;
  }, [direction]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <coneGeometry args={[0.02, 0.06, 6]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
    </mesh>
  );
}

export default function TravelArcs({ radius }: TravelArcsProps) {
  const arcs = useMemo(() => {
    const result: { 
      points: THREE.Vector3[]; 
      key: string;
      arrowPos: THREE.Vector3;
      arrowDir: THREE.Vector3;
    }[] = [];

    for (let i = 0; i < races2024.length - 1; i++) {
      const from = races2024[i];
      const to = races2024[i + 1];

      const startPos = latLngToVector3(from.lat, from.lng, radius);
      const endPos = latLngToVector3(to.lat, to.lng, radius);

      const points = createArcPoints(startPos, endPos, radius);
      
      const midIndex = Math.floor(points.length * 0.6);
      const arrowPos = points[midIndex];
      const arrowDir = points[midIndex + 1].clone().sub(points[midIndex - 1]).normalize();
      
      result.push({ points, key: `${from.id}-${to.id}`, arrowPos, arrowDir });
    }

    return result;
  }, [radius]);

  return (
    <group>
      {arcs.map(({ points, key, arrowPos, arrowDir }) => (
        <group key={key}>
          <Line
            points={points}
            color="#3b82f6"
            lineWidth={1}
            transparent
            opacity={0.4}
          />
          <ArrowHead position={arrowPos} direction={arrowDir} />
        </group>
      ))}
    </group>
  );
}
