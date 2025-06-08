import React, { useMemo } from 'react';
import { Vector3, BufferGeometry, LineBasicMaterial, Line } from 'three';
import { Edge, Node } from '@/types/nodes';

interface Edge3DProps {
  edge: Edge;
  sourceNode: Node;
  targetNode: Node;
}

export function Edge3D({ edge, sourceNode, targetNode }: Edge3DProps) {
  const points = useMemo(() => {
    const start = new Vector3(
      sourceNode.position_x,
      sourceNode.position_y,
      sourceNode.position_z
    );
    const end = new Vector3(
      targetNode.position_x,
      targetNode.position_y,
      targetNode.position_z
    );
    return [start, end];
  }, [sourceNode, targetNode]);

  const geometry = useMemo(() => {
    return new BufferGeometry().setFromPoints(points);
  }, [points]);

  const material = useMemo(() => {
    return new LineBasicMaterial({
      color: edge.data?.type === 'error' ? '#ff4444' :
             edge.data?.type === 'warning' ? '#ffaa00' :
             edge.data?.type === 'success' ? '#44ff44' :
             '#666666',
      linewidth: 2,
    });
  }, [edge.data?.type]);

  return <primitive object={new Line(geometry, material)} />;
} 