import React, { useEffect, useState, useCallback } from 'react';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Node, Edge, NodePosition, CreateNodeInput, CreateEdgeInput } from '@/types/nodes';
import { getNodes, getEdges, createNode, createEdge, deleteNode } from '@/lib/api/nodes';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useRealtime } from '@/hooks/useRealtime';
import { Node3D } from './Node3D';
import { Edge3D } from './Edge3D';
import { NodeEditor } from './NodeEditor';

export function Canvas() {
  console.log('Canvas component rendered');
  const { currentWorkspace } = useWorkspace();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // Load nodes and edges when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadNodesAndEdges();
    }
  }, [currentWorkspace]);

  // Set up real-time subscriptions
  useRealtime(currentWorkspace?.id || '', {
    onNodeCreated: (node) => {
      setNodes(prev => [...prev, node]);
    },
    onNodeUpdated: (node) => {
      setNodes(prev => prev.map(n => n.id === node.id ? node : n));
      if (selectedNode?.id === node.id) {
        setSelectedNode(node);
      }
    },
    onNodeDeleted: (nodeId) => {
      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(e => 
        e.source_node_id !== nodeId && e.target_node_id !== nodeId
      ));
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
        setShowEditor(false);
      }
    },
    onEdgeCreated: (edge) => {
      setEdges(prev => [...prev, edge]);
    },
    onEdgeUpdated: (edge) => {
      setEdges(prev => prev.map(e => e.id === edge.id ? edge : e));
    },
    onEdgeDeleted: (edgeId) => {
      setEdges(prev => prev.filter(e => e.id !== edgeId));
    },
  });

  const loadNodesAndEdges = async () => {
    if (!currentWorkspace) return;
    
    try {
      const [loadedNodes, loadedEdges] = await Promise.all([
        getNodes(currentWorkspace.id),
        getEdges(currentWorkspace.id)
      ]);
      
      setNodes(loadedNodes);
      setEdges(loadedEdges);
    } catch (error) {
      console.error('Error loading nodes and edges:', error);
    }
  };

  const handleNodeCreate = async (position: NodePosition) => {
    console.log('Creating node at', position);
    if (!currentWorkspace) return;

    try {
      const newNode: CreateNodeInput = {
        workspaceId: currentWorkspace.id,
        type: 'default',
        position,
        data: {
          label: 'New Node',
          color: '#4a90e2'
        }
      };

      await createNode(newNode);
    } catch (error) {
      console.error('Error creating node:', error);
    }
  };

  const handleNodeSelect = (node: Node) => {
    if (isLinking && selectedNode && selectedNode.id !== node.id) {
      createNodeLink(selectedNode, node);
    } else {
      setSelectedNode(node);
      setShowEditor(true);
    }
  };

  const handleNodeDelete = async () => {
    if (!selectedNode) return;

    try {
      await deleteNode(selectedNode.id);
      setSelectedNode(null);
      setShowEditor(false);
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  const createNodeLink = async (source: Node, target: Node) => {
    if (!currentWorkspace) return;

    try {
      const newEdge: CreateEdgeInput = {
        workspaceId: currentWorkspace.id,
        sourceNodeId: source.id,
        targetNodeId: target.id,
        type: 'default',
        data: {
          label: `${source.data.label} → ${target.data.label}`
        }
      };

      await createEdge(newEdge);
      setIsLinking(false);
      setSelectedNode(null);
    } catch (error) {
      console.error('Error creating edge:', error);
    }
  };

  const handleCanvasClick = (event: any) => {
    console.log('Canvas clicked', event);
    if (event.target.type === 'Mesh') return;

    const { point } = event;
    handleNodeCreate({ x: point.x, y: point.y, z: point.z });
  };

  const toggleLinking = () => {
    setIsLinking(!isLinking);
    if (!isLinking) {
      setSelectedNode(null);
      setShowEditor(false);
    }
  };

  return (
    <div className="w-full h-full">
      <button onClick={() => console.log('Button clicked!')}>Test Button</button>
      {/* Debug overlay to test click events */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 200,
          width: 200,
          height: 200,
          background: 'rgba(255,0,0,0.2)',
          zIndex: 9999,
          pointerEvents: 'auto',
        }}
        onClick={() => console.log('Overlay clicked')}
      >
        Click test
      </div>
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={toggleLinking}
          className={`px-4 py-2 rounded-md ${
            isLinking ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}
        >
          {isLinking ? 'Cancel Linking' : 'Start Linking'}
        </button>
        
        {selectedNode && (
          <button
            onClick={handleNodeDelete}
            className="px-4 py-2 rounded-md bg-red-500 text-white"
          >
            Delete Node
          </button>
        )}
      </div>
      
      <ThreeCanvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        onPointerDown={handleCanvasClick}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={3.3}
          sectionThickness={1.5}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
        <OrbitControls />
        
        {nodes.map((node) => (
          <Node3D
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            onClick={() => handleNodeSelect(node)}
          />
        ))}
        
        {edges.map((edge) => (
          <Edge3D
            key={edge.id}
            edge={edge}
            sourceNode={nodes.find(n => n.id === edge.source_node_id)!}
            targetNode={nodes.find(n => n.id === edge.target_node_id)!}
          />
        ))}
      </ThreeCanvas>

      {showEditor && selectedNode && (
        <NodeEditor
          node={selectedNode}
          onClose={() => {
            setShowEditor(false);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
} 