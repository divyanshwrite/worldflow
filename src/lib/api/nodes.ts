import { supabase } from '@/lib/supabase/client';
import {
  Node,
  Edge,
  CreateNodeInput,
  UpdateNodeInput,
  CreateEdgeInput,
  UpdateEdgeInput,
} from '@/types/nodes';

export async function getNodes(workspaceId: string): Promise<Node[]> {
  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('workspace_id', workspaceId);

  if (error) throw error;
  return data;
}

export async function getNode(id: string): Promise<Node> {
  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createNode(input: CreateNodeInput): Promise<Node> {
  const { data, error } = await supabase
    .from('nodes')
    .insert({
      workspace_id: input.workspaceId,
      type: input.type,
      position_x: input.position.x,
      position_y: input.position.y,
      position_z: input.position.z,
      data: input.data || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNode(input: UpdateNodeInput): Promise<Node> {
  const updateData: any = {};
  
  if (input.position) {
    updateData.position_x = input.position.x;
    updateData.position_y = input.position.y;
    updateData.position_z = input.position.z;
  }
  
  if (input.data) {
    updateData.data = input.data;
  }

  const { data, error } = await supabase
    .from('nodes')
    .update(updateData)
    .eq('id', input.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNode(id: string): Promise<void> {
  const { error } = await supabase
    .from('nodes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getEdges(workspaceId: string): Promise<Edge[]> {
  const { data, error } = await supabase
    .from('edges')
    .select('*')
    .eq('workspace_id', workspaceId);

  if (error) throw error;
  return data;
}

export async function getEdge(id: string): Promise<Edge> {
  const { data, error } = await supabase
    .from('edges')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createEdge(input: CreateEdgeInput): Promise<Edge> {
  const { data, error } = await supabase
    .from('edges')
    .insert({
      workspace_id: input.workspaceId,
      source_node_id: input.sourceNodeId,
      target_node_id: input.targetNodeId,
      type: input.type,
      data: input.data || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEdge(input: UpdateEdgeInput): Promise<Edge> {
  const { data, error } = await supabase
    .from('edges')
    .update({ data: input.data })
    .eq('id', input.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEdge(id: string): Promise<void> {
  const { error } = await supabase
    .from('edges')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 