import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

import { races2024 } from "../data/races";
import type { Race } from "../data/types";
import RaceMarker from "./RaceMarker";
import TravelArcs from "./TravelArcs";

const GLOBE_RADIUS = 2;

interface EarthProps {
  onSelectRace: (race: Race | null) => void;
  selectedRace: Race | null;
  isHovering: boolean;
  onHover: (hovered: boolean) => void;
}

const BASE_ROTATION_SPEED = 0.001;
const BASE_CAMERA_DISTANCE = 8;

function Earth({ onSelectRace, selectedRace, isHovering, onHover }: EarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/earth.jpg");

  useFrame(({ camera }) => {
    if (groupRef.current && !selectedRace && !isHovering) {
      const cameraDistance = camera.position.length();
      const speedScale = Math.pow(cameraDistance / BASE_CAMERA_DISTANCE, 2);
      groupRef.current.rotation.y += BASE_ROTATION_SPEED * speedScale;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh onClick={() => onSelectRace(null)}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <TravelArcs radius={GLOBE_RADIUS + 0.005} />
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

function AdaptiveControls() {
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (controlsRef.current) {
      const distance = camera.position.length();
      const rotateSpeed = Math.pow(distance / BASE_CAMERA_DISTANCE, 1.5) * 0.3;
      controlsRef.current.rotateSpeed = Math.max(0.05, Math.min(0.5, rotateSpeed));
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      minDistance={3}
      maxDistance={10}
      zoomSpeed={0.7}
      enableDamping={true}
      dampingFactor={0.08}
    />
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
      camera={{ position: [0, 0, 8], fov: 45 }}
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
      <AdaptiveControls />
    </Canvas>
  );
}
