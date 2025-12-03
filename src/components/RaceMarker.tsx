import { useRef, useState } from "react";
import * as THREE from "three";
import type { Race } from "../data/types";

interface RaceMarkerProps {
  race: Race;
  radius: number;
  onSelect: (race: Race | null) => void;
  onHover: (hovered: boolean) => void;
  isSelected: boolean;
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function RaceMarker({ race, radius, onSelect, onHover, isSelected }: RaceMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const position = latLngToVector3(race.lat, race.lng, radius);
  const markerSize = isSelected ? 0.06 : hovered ? 0.05 : 0.04;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSelected ? null : race);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      <sphereGeometry args={[markerSize, 16, 16]} />
      <meshBasicMaterial
        color={isSelected ? "#ef4444" : hovered ? "#f59e0b" : "#3b82f6"}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

export { latLngToVector3 };
