
import React, { useState, useRef } from 'react';
import { LessonParams } from '../types';
import { BookOpen, Globe, Hash, FileText, Layers, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface InputFormProps {
  onSubmit: (params: LessonParams) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formState, setFormState] = useState<LessonParams>({
    grade: '3',
    subject: 'Maths',
    loCode: 'MT03A01',
    learningObjective: 'Subtracts 3 digit numbers without borrowing',
    topicOutcome: 'Solve word problems involving 3-digit subtraction',
    regionalLanguage: 'Hindi',
    ncertContext: ''
  });

  const [pdfFile, setPdfFile] = useState<{ name: string, data: string, mimeType: string } | null>(null);
  const [customIcon, setCustomIcon] = useState<string | undefined>(undefined);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert("Please upload a valid PDF file.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        setPdfFile({
            name: file.name,
            data: base64Data,
            mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert("Please upload a valid image file.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setCustomIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeIcon = () => {
    setCustomIcon(undefined);
    if (iconInputRef.current) {
      iconInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formState,
      ncertPdf: pdfFile || undefined,
      customIcon: customIcon
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-orange-100">
      <div className="mb-8 border-b pb-6 border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-orange-600" />
          Lesson Configuration
        </h2>
        <p className="text-gray-500 mt-2">Define the scope for the CLT-based lesson. Upload NCERT material for better alignment.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
            <select 
              name="grade" 
              value={formState.grade} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 focus:bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input 
              type="text" 
              name="subject" 
              value={formState.subject} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="e.g. Maths"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="relative">
             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
               <Hash className="w-4 h-4 text-gray-400" /> LO Code
             </label>
             <input 
               type="text" 
               name="loCode" 
               value={formState.loCode} 
               onChange={handleChange}
               className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
               placeholder="e.g. MT03_L01"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
               <Globe className="w-4 h-4 text-gray-400" /> Regional Language
             </label>
             <select 
               name="regionalLanguage" 
               value={formState.regionalLanguage} 
               onChange={handleChange}
               className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
             >
               <option value="Hindi">Hindi</option>
               <option value="Marathi">Marathi</option>
               <option value="Telugu">Telugu</option>
               <option value="Tamil">Tamil</option>
               <option value="Kannada">Kannada</option>
               <option value="Bengali">Bengali</option>
               <option value="Gujarati">Gujarati</option>
               <option value="Malayalam">Malayalam</option>
               <option value="Punjabi">Punjabi</option>
             </select>
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" /> Learning Objective
          </label>
          <input 
            type="text" 
            name="learningObjective" 
            value={formState.learningObjective} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="Brief objective (English)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" /> Topic Outcome & Context
          </label>
          <textarea 
            name="topicOutcome" 
            value={formState.topicOutcome} 
            onChange={handleChange}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="Specific outcome expected from the student..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
             {/* PDF Upload */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    NCERT PDF (Optional)
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 h-32 ${pdfFile ? 'border-orange-200 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'}`}>
                {!pdfFile ? (
                    <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Upload Chapter PDF</p>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full bg-white p-2 rounded border border-orange-100">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span className="text-xs text-gray-700 truncate">{pdfFile.name}</span>
                        </div>
                        <button type="button" onClick={removeFile} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                )}
                </div>
            </div>

            {/* Icon Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Icon / Mascot (Optional)
                </label>
                <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 h-32 ${customIcon ? 'border-orange-200 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'}`}>
                {!customIcon ? (
                    <>
                    <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Upload PNG/JPG</p>
                    <input 
                        ref={iconInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleIconChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    </>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img src={customIcon} alt="Icon Preview" className="max-h-20 object-contain" />
                        <button type="button" onClick={removeIcon} className="absolute top-0 right-0 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                )}
                </div>
            </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
             Additional Context
          </label>
          <textarea 
            name="ncertContext" 
            value={formState.ncertContext} 
            onChange={handleChange}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-all"
            placeholder="Paste text from relevant NCERT chapters or existing lesson plans..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all flex justify-center items-center gap-3 shadow-lg
            ${isLoading 
              ? 'bg-orange-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 hover:shadow-xl hover:-translate-y-0.5'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-6 h-6" />
              Generating Lesson...
            </>
          ) : (
            <>
              Generate Lesson Content
            </>
          )}
        </button>
      </form>
    </div>
  );
};
