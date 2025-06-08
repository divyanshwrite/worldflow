import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Node, Edge } from '@/types/nodes';

type RealtimeCallback = {
  onNodeCreated?: (node: Node) => void;
  onNodeUpdated?: (node: Node) => void;
  onNodeDeleted?: (nodeId: string) => void;
  onEdgeCreated?: (edge: Edge) => void;
  onEdgeUpdated?: (edge: Edge) => void;
  onEdgeDeleted?: (edgeId: string) => void;
};

export function useRealtime(workspaceId: string, callbacks: RealtimeCallback) {
  useEffect(() => {
    if (!workspaceId) return;

    // Subscribe to node changes
    const nodeSubscription = supabase
      .channel(`nodes:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nodes',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              callbacks.onNodeCreated?.(payload.new as Node);
              break;
            case 'UPDATE':
              callbacks.onNodeUpdated?.(payload.new as Node);
              break;
            case 'DELETE':
              callbacks.onNodeDeleted?.(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Subscribe to edge changes
    const edgeSubscription = supabase
      .channel(`edges:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'edges',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              callbacks.onEdgeCreated?.(payload.new as Edge);
              break;
            case 'UPDATE':
              callbacks.onEdgeUpdated?.(payload.new as Edge);
              break;
            case 'DELETE':
              callbacks.onEdgeDeleted?.(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      nodeSubscription.unsubscribe();
      edgeSubscription.unsubscribe();
    };
  }, [workspaceId, callbacks]);
} 