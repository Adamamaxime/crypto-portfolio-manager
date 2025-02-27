import React from 'react';
import { Plus } from 'lucide-react';

interface IdeaFormProps {
  newIdea: string;
  setNewIdea: (idea: string) => void;
  addIdea: () => void;
}

export function IdeaForm({ newIdea, setNewIdea, addIdea }: IdeaFormProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Ajouter une nouvelle idée..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          onKeyPress={(e) => e.key === 'Enter' && addIdea()}
        />
        <button
          onClick={addIdea}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </button>
      </div>
    </div>
  );
}