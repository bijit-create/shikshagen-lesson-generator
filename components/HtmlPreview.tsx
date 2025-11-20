import React, { useEffect, useRef, useState } from 'react';
import { Edit, Save, X } from 'lucide-react';

interface HtmlPreviewProps {
  htmlContent: string;
  title: string;
  isEditable?: boolean;
  onHtmlUpdate?: (newHtml: string) => void;
}

export const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlContent, title, isEditable, onHtmlUpdate }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Function to inject content and scripts safely
  const loadContent = (content: string) => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(content);
        doc.close();
        
        // Inject basic styles to normalize view if missing
        const style = doc.createElement('style');
        style.textContent = `
            body { min-height: 100vh; overflow-x: hidden; } 
            *[contenteditable="true"] { outline: 2px dashed #3b82f6; padding: 4px; border-radius: 4px; }
        `;
        doc.head.appendChild(style);
      }
    }
  };

  // Initial Load
  useEffect(() => {
    if (!isEditing) {
      loadContent(htmlContent);
    }
  }, [htmlContent, isEditing]);

  const handleEdit = () => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      
      // 1. Enable Design Mode (Global)
      doc.designMode = 'on';
      
      // 2. Explicitly set contentEditable on the body
      doc.body.setAttribute('contenteditable', 'true');
      
      // 3. Add a visual cue style so user knows it's editable
      const styleId = 'editor-styles';
      if (!doc.getElementById(styleId)) {
          const style = doc.createElement('style');
          style.id = styleId;
          style.textContent = `
            body { cursor: text !important; }
            body:hover { box-shadow: inset 0 0 0 2px #e2e8f0; }
            body:focus-within { box-shadow: inset 0 0 0 2px #3b82f6; background-color: #fafcff; }
          `;
          doc.head.appendChild(style);
      }
      
      // 4. Focus
      doc.body.focus();
      
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      
      // Cleanup
      doc.designMode = 'off';
      doc.body.removeAttribute('contenteditable');
      const styleNode = doc.getElementById('editor-styles');
      if (styleNode) styleNode.remove();
      
      // Extract HTML
      const newHtml = doc.documentElement.outerHTML;
      
      if (onHtmlUpdate) {
        onHtmlUpdate(newHtml);
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original to discard changes
    loadContent(htmlContent);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-md">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-mono text-gray-500 flex justify-between items-center">
            <span className="font-semibold text-gray-700">{title}</span>
            <div className="flex items-center gap-2">
                {isEditable && !isEditing && (
                    <button 
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:text-blue-600 hover:border-blue-400 hover:shadow-sm transition-all"
                    >
                        <Edit className="w-3.5 h-3.5" /> 
                        <span>Edit Visual</span>
                    </button>
                )}
                {isEditing && (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                            <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white border border-green-600 rounded hover:bg-green-700 shadow-sm transition-all"
                        >
                            <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
        <div className="flex-1 flex justify-center bg-gray-100 relative">
            {/* Container */}
            <div className={`w-full h-full min-h-[600px] bg-white overflow-hidden relative transition-all duration-300 ${isEditing ? 'ring-4 ring-blue-50 ring-inset' : ''}`}>
                <iframe 
                    ref={iframeRef}
                    title="Lesson Preview"
                    className="w-full h-full border-none"
                    // Ensure no sandbox restrictions prevent editing
                />
            </div>
        </div>
    </div>
  );
};
