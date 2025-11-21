import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plus, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'error';
  content: string;
  mode: 'modify' | 'add';
  timestamp: Date;
}

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onModifyBlocks: (prompt: string) => Promise<void>;
  onAddPage: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  isOpen,
  onClose,
  onModifyBlocks,
  onAddPage,
  isLoading
}) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'modify' | 'add'>('modify');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userPrompt = prompt.trim();
    const currentMode = mode;
    setPrompt('');

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userPrompt,
      mode: currentMode,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Execute the appropriate action
      if (currentMode === 'modify') {
        await onModifyBlocks(userPrompt);
      } else {
        await onAddPage(userPrompt);
      }

      // Add success message
      const successMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: currentMode === 'modify' 
          ? '✓ Content has been modified successfully!' 
          : '✓ New page has been added successfully!',
        mode: currentMode,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        mode: currentMode,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-5 py-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-lg">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-white/70 hover:text-white text-xs font-medium px-2 py-1 rounded hover:bg-white/10 transition-colors"
              title="Clear chat history"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('modify')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'modify'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-1" />
            Modify Content
          </button>
          <button
            onClick={() => setMode('add')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'add'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Page
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
        <p className="text-xs text-blue-700">
          {mode === 'modify' ? (
            <>
              <strong>Modify Mode:</strong> Ask to change existing content.
              <br />
              Example: "Make the examples more challenging" or "Add more practice questions"
            </>
          ) : (
            <>
              <strong>Add Page Mode:</strong> Request a new page.
              <br />
              Example: "Add a page about real-world applications" or "Create a quiz page"
            </>
          )}
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-5 overflow-y-auto min-h-[200px] max-h-[300px]">
        <div className="space-y-3">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-semibold mb-1">👋 Hello!</p>
              <p>I can help you modify your lesson or add new pages. Choose a mode above and tell me what you'd like!</p>
            </div>
          )}

          {/* Conversation History */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg p-3 text-sm ${
                message.type === 'user'
                  ? 'bg-orange-100 text-gray-800 ml-4'
                  : message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200 mr-4'
                  : 'bg-green-50 text-green-700 border border-green-200 mr-4'
              }`}
            >
              {message.type === 'user' && (
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-xs uppercase text-orange-600">
                    {message.mode === 'modify' ? '✨ Modify' : '➕ Add'}:
                  </span>
                  <p className="flex-1">{message.content}</p>
                </div>
              )}
              {message.type === 'assistant' && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <p>{message.content}</p>
                </div>
              )}
              {message.type === 'error' && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Error</p>
                    <p className="text-xs">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="bg-orange-50 rounded-lg p-3 text-sm text-orange-700 border border-orange-200 mr-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>AI is working on your request...</span>
              </div>
            </div>
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === 'modify'
                ? 'Describe what to change...'
                : 'Describe the new page...'
            }
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};


