
import React, { useState } from 'react';
import { EditableBlocks } from '../types';
import { RefreshCw, Save } from 'lucide-react';

interface EditableViewProps {
  blocks: EditableBlocks;
  onRegenerate: (newBlocks: EditableBlocks) => void;
  onAiAssist?: (blockKey: string, currentText: string, instruction: string) => Promise<string>;
  isLoading: boolean;
}

export const EditableView: React.FC<EditableViewProps> = ({ blocks, onRegenerate, isLoading }) => {
  const [editedBlocks, setEditedBlocks] = useState<EditableBlocks>(blocks);

  const handleTextChange = (key: keyof EditableBlocks, value: string) => {
    setEditedBlocks(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key: 'worked_example_steps', index: number, value: string) => {
    const newSteps = [...editedBlocks.worked_example_steps];
    newSteps[index] = value;
    setEditedBlocks(prev => ({ ...prev, worked_example_steps: newSteps }));
  };
  
  // Simplified deep editing for demo purposes - primarily focusing on string fields
  // For complex objects like practice_questions, we'll keep them as JSON strings for power users or simplifed form for demo

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm max-w-5xl mx-auto">
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold text-gray-800">Edit Source Blocks</h3>
            <p className="text-sm text-gray-500">Modify the core content below and regenerate the HTML lessons.</p>
        </div>
        <button 
            onClick={() => onRegenerate(editedBlocks)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium transition-all
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700 shadow-md hover:shadow-lg'}`}
        >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isLoading ? 'Regenerating...' : 'Regenerate Lesson'}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Title */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">Title</label>
            <input 
                type="text" 
                value={editedBlocks.title} 
                onChange={(e) => handleTextChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
            />
        </div>

        {/* Objective */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">Objective</label>
            <textarea 
                value={editedBlocks.objective} 
                onChange={(e) => handleTextChange('objective', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none h-20"
            />
        </div>

        {/* Intro */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">Intro Text</label>
            <textarea 
                value={editedBlocks.intro_text} 
                onChange={(e) => handleTextChange('intro_text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none h-24"
            />
        </div>

        {/* Worked Examples */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">Worked Example Steps</label>
            {editedBlocks.worked_example_steps.map((step, idx) => (
                <div key={idx} className="mb-2 flex gap-2">
                    <span className="text-gray-400 pt-2 text-xs">{idx + 1}.</span>
                    <textarea 
                        value={step}
                        onChange={(e) => handleArrayChange('worked_example_steps', idx, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none h-16"
                    />
                </div>
            ))}
        </div>

        {/* Complex Objects (Questions) - JSON Mode for now to save UI space */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">Practice Questions (JSON)</label>
            <textarea 
                value={JSON.stringify(editedBlocks.practice_questions, null, 2)} 
                onChange={(e) => {
                    try {
                        const val = JSON.parse(e.target.value);
                        setEditedBlocks(prev => ({ ...prev, practice_questions: val }));
                    } catch (e) {
                        // Ignore parse errors while typing
                    }
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none h-40 font-mono text-xs"
            />
            <p className="text-xs text-gray-400 mt-1">Edit the JSON structure directly to change questions and answers.</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">Reflection Question</label>
            <input 
                type="text" 
                value={editedBlocks.reflection_question} 
                onChange={(e) => handleTextChange('reflection_question', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
            />
        </div>
      </div>
    </div>
  );
};
