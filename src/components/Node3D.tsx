import React, { useRef } from 'react';
import { Mesh } from 'three';
import { Node } from '@/types/nodes';

interface Node3DProps {
  node: Node;
  isSelected: boolean;
  onClick: () => void;
}

export function Node3D({ node, isSelected, onClick }: Node3DProps) {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      position={[node.position_x, node.position_y, node.position_z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={node.data?.color || '#4a90e2'}
        emissive={isSelected ? '#ffffff' : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
    </mesh>
  );
} 