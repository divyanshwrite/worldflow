-- Create nodes table
CREATE TABLE nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    position_z FLOAT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create edges table
CREATE TABLE edges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    source_node_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(source_node_id, target_node_id)
);

-- Add RLS policies
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

-- Nodes policies
CREATE POLICY "Users can view nodes in their workspaces"
    ON nodes FOR SELECT
    USING (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert nodes in their workspaces"
    ON nodes FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update nodes in their workspaces"
    ON nodes FOR UPDATE
    USING (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete nodes in their workspaces"
    ON nodes FOR DELETE
    USING (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

-- Edges policies
CREATE POLICY "Users can view edges in their workspaces"
    ON edges FOR SELECT
    USING (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert edges in their workspaces"
    ON edges FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update edges in their workspaces"
    ON edges FOR UPDATE
    USING (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete edges in their workspaces"
    ON edges FOR DELETE
    USING (
        workspace_id IN (
            SELECT id FROM workspaces
            WHERE user_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX idx_nodes_workspace_id ON nodes(workspace_id);
CREATE INDEX idx_edges_workspace_id ON edges(workspace_id);
CREATE INDEX idx_edges_source_node_id ON edges(source_node_id);
CREATE INDEX idx_edges_target_node_id ON edges(target_node_id); 