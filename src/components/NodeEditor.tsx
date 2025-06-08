import React, { useState, useEffect } from 'react';
import { Node, NodeData } from '@/types/nodes';
import { updateNode } from '@/lib/api/nodes';

interface NodeEditorProps {
  node: Node;
  onClose: () => void;
}

export function NodeEditor({ node, onClose }: NodeEditorProps) {
  const [label, setLabel] = useState(node.data?.label || '');
  const [description, setDescription] = useState(node.data?.description || '');
  const [color, setColor] = useState(node.data?.color || '#4a90e2');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLabel(node.data?.label || '');
    setDescription(node.data?.description || '');
    setColor(node.data?.color || '#4a90e2');
  }, [node]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData: NodeData = {
        ...node.data,
        label,
        description,
        color,
      };

      await updateNode({
        id: node.id,
        data: updatedData,
      });
      onClose();
    } catch (error) {
      console.error('Error updating node:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit Node</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
} 