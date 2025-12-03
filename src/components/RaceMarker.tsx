import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Race } from "../data/types";

interface RaceMarkerProps {
  race: Race;
  radius: number;
  onSelect: (race: Race | null) => void;
  onHover: (hovered: boolean) => void;
  isSelected: boolean;
}

const BASE_CAMERA_DISTANCE = 8;

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
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const currentSize = useRef(0.04);
  const currentGlowSize = useRef(0.08);
  const { camera } = useThree();

  const position = latLngToVector3(race.lat, race.lng, radius);
  const targetSize = isSelected ? 0.07 : hovered ? 0.06 : 0.05;
  const targetGlowSize = isSelected ? 0.16 : hovered ? 0.14 : 0.12;
  const glowOpacity = isSelected ? 0.6 : hovered ? 0.5 : 0.35;
  const color = isSelected ? "#ef4444" : hovered ? "#f59e0b" : "#3b82f6";

  useFrame(() => {
    const cameraDistance = camera.position.length();
    const zoomScale = Math.pow(cameraDistance / BASE_CAMERA_DISTANCE, 1.8);
    const clampedScale = Math.max(0.15, Math.min(1.5, zoomScale));
    
    currentSize.current += (targetSize - currentSize.current) * 0.15;
    currentGlowSize.current += (targetGlowSize - currentGlowSize.current) * 0.15;
    
    if (meshRef.current) {
      meshRef.current.scale.setScalar((currentSize.current / 0.04) * clampedScale);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar((currentGlowSize.current / 0.08) * clampedScale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={glowRef}
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
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={glowOpacity}
        />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

export { latLngToVector3 };
