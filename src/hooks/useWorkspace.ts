import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

export function useWorkspace() {
  const router = useRouter();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const workspaceId = router.query.workspaceId as string;
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    async function loadWorkspace() {
      try {
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', workspaceId)
          .single();

        if (error) throw error;
        setCurrentWorkspace(data);
      } catch (error) {
        console.error('Error loading workspace:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [router.isReady, router.query.workspaceId]);

  return {
    currentWorkspace,
    loading,
  };
} 