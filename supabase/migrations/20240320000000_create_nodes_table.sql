-- Create nodes table
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  position JSONB NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on flow_id for faster lookups
CREATE INDEX nodes_flow_id_idx ON nodes(flow_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_nodes_updated_at
  BEFORE UPDATE ON nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view nodes in flows they have access to
CREATE POLICY "Users can view nodes in their flows"
  ON nodes FOR SELECT
  USING (
    flow_id IN (
      SELECT id FROM flows
      WHERE user_id = auth.uid()
    )
  );

-- Create policy to allow users to insert nodes in their flows
CREATE POLICY "Users can insert nodes in their flows"
  ON nodes FOR INSERT
  WITH CHECK (
    flow_id IN (
      SELECT id FROM flows
      WHERE user_id = auth.uid()
    )
  );

-- Create policy to allow users to update nodes in their flows
CREATE POLICY "Users can update nodes in their flows"
  ON nodes FOR UPDATE
  USING (
    flow_id IN (
      SELECT id FROM flows
      WHERE user_id = auth.uid()
    )
  );

-- Create policy to allow users to delete nodes in their flows
CREATE POLICY "Users can delete nodes in their flows"
  ON nodes FOR DELETE
  USING (
    flow_id IN (
      SELECT id FROM flows
      WHERE user_id = auth.uid()
    )
  ); 