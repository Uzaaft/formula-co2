import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { races2024 } from "../data/races";
import type { Race } from "../data/types";
import RaceMarker from "./RaceMarker";

const GLOBE_RADIUS = 2;

interface EarthProps {
  onSelectRace: (race: Race | null) => void;
  selectedRace: Race | null;
  isHovering: boolean;
  onHover: (hovered: boolean) => void;
}

function Earth({ onSelectRace, selectedRace, isHovering, onHover }: EarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/earth.jpg");

  useFrame(() => {
    if (groupRef.current && !selectedRace && !isHovering) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh onClick={() => onSelectRace(null)}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {races2024.map((race) => (
        <RaceMarker
          key={race.id}
          race={race}
          radius={GLOBE_RADIUS + 0.01}
          onSelect={onSelectRace}
          onHover={onHover}
          isSelected={selectedRace?.id === race.id}
        />
      ))}
    </group>
  );
}

interface GlobeProps {
  onSelectRace?: (race: Race | null) => void;
  selectedRace?: Race | null;
}

export default function Globe({ onSelectRace, selectedRace }: GlobeProps) {
  const [internalSelected, setInternalSelected] = useState<Race | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleSelect = onSelectRace ?? setInternalSelected;
  const currentSelected = selectedRace ?? internalSelected;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <Earth 
        onSelectRace={handleSelect} 
        selectedRace={currentSelected}
        isHovering={isHovering}
        onHover={setIsHovering}
      />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
