import { Database } from './supabase';

export type Node = Database['public']['Tables']['nodes']['Row'];
export type Edge = Database['public']['Tables']['edges']['Row'];

export type NodePosition = {
  x: number;
  y: number;
  z: number;
};

export type NodeData = {
  label?: string;
  description?: string;
  color?: string;
  icon?: string;
  [key: string]: any;
};

export type EdgeData = {
  label?: string;
  type?: 'default' | 'success' | 'warning' | 'error';
  [key: string]: any;
};

export type CreateNodeInput = {
  workspaceId: string;
  type: string;
  position: NodePosition;
  data?: NodeData;
};

export type UpdateNodeInput = {
  id: string;
  position?: NodePosition;
  data?: NodeData;
};

export type CreateEdgeInput = {
  workspaceId: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: string;
  data?: EdgeData;
};

export type UpdateEdgeInput = {
  id: string;
  data?: EdgeData;
}; 