import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { HtmlPreview } from './components/HtmlPreview';
import { EditableView } from './components/EditableView';
import { ChatAssistant } from './components/ChatAssistant';
import { generateLesson, modifyLessonBlocks, generateNewPage, rewriteSpecificBlock } from './services/geminiService';
import { LessonParams, GeneratedLesson, ViewMode, EditableBlocks } from './types';
import { Layout, FileText, UserCheck, Edit3, ArrowLeft, ChevronRight, ChevronLeft, Columns, Smartphone, Download, PlayCircle, Trash2, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FORM);
  const [loading, setLoading] = useState(false);
  const [lessonData, setLessonData] = useState<GeneratedLesson | null>(null);
  const [currentParams, setCurrentParams] = useState<LessonParams | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleGenerate = async (params: LessonParams) => {
    setLoading(true);
    setError(null);
    setCurrentParams(params);
    try {
      const result = await generateLesson(params);
      setLessonData(result);
      setViewMode(ViewMode.SPLIT); // Default to parallel view
      setCurrentPageIndex(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate lesson content. Please check your API key or try again.";
      setError(errorMessage);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateFromBlocks = async (refinedBlocks: EditableBlocks) => {
    if (!currentParams) return;
    setLoading(true);
    try {
        const newParams = { ...currentParams, refinedBlocks };
        const result = await generateLesson(newParams);
        setLessonData(result);
        setViewMode(ViewMode.SPLIT);
        setCurrentPageIndex(0);
    } catch (err) {
        setError("Failed to regenerate lesson. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // 1. Global Chat Action: Modify Blocks
  const handleChatModify = async (prompt: string) => {
    if (!currentParams || !lessonData) return;
    setLoading(true);
    try {
        const newBlocks = await modifyLessonBlocks(lessonData.editable_blocks, prompt, currentParams);
        await handleRegenerateFromBlocks(newBlocks);
    } catch (err) {
        setError("Failed to modify lesson. Please try again.");
        setLoading(false);
    }
  };

  // 2. Global Chat Action: Add Page
  const handleChatAddPage = async (prompt: string) => {
    if (!currentParams || !lessonData) return;
    setLoading(true);
    try {
        const newPage = await generateNewPage(currentParams, prompt);
        setLessonData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                regional_html_pages: [...prev.regional_html_pages, newPage.regional],
                english_html_pages: [...prev.english_html_pages, newPage.english]
            };
        });
        setCurrentPageIndex(lessonData.regional_html_pages.length); // Jump to new page
    } catch (err) {
        setError("Failed to add page. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // 3. Block Action: Rewrite Specific Block
  const handleBlockAssist = async (blockKey: string, currentText: string, instruction: string): Promise<string> => {
    if (!currentParams) return currentText;
    return await rewriteSpecificBlock(blockKey, currentText, instruction, currentParams);
  };

  const handleDeletePage = () => {
    if (!lessonData) return;
    if (lessonData.regional_html_pages.length <= 1) {
        alert("You cannot delete the last page.");
        return;
    }
    
    if (confirm("Are you sure you want to delete this page?")) {
        const newRegional = [...lessonData.regional_html_pages];
        const newEnglish = [...lessonData.english_html_pages];
        
        newRegional.splice(currentPageIndex, 1);
        newEnglish.splice(currentPageIndex, 1);
        
        setLessonData({
            ...lessonData,
            regional_html_pages: newRegional,
            english_html_pages: newEnglish
        });
        
        if (currentPageIndex >= newRegional.length) {
            setCurrentPageIndex(newRegional.length - 1);
        }
    }
  };

  const updateHtmlPage = (type: 'regional' | 'english', index: number, newHtml: string) => {
    if (!lessonData) return;
    const newData = { ...lessonData };
    if (type === 'regional') {
        newData.regional_html_pages[index] = newHtml;
    } else {
        newData.english_html_pages[index] = newHtml;
    }
    setLessonData(newData);
  };

  const handleDownload = (htmlContent: string, filename: string) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPlayable = () => {
    if (!lessonData || !currentParams) return;

    const pages = lessonData.regional_html_pages;
    const iconSrc = currentParams.customIcon || "https://cdn-icons-png.flaticon.com/512/2232/2232688.png";
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Lesson: ${currentParams.loCode}</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; }
    #app { display: flex; flex-direction: column; height: 100%; max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.05); position: relative; }
    header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; height: 60px; box-sizing: border-box; }
    .brand { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #ea580c; font-size: 1.1rem; }
    .brand img { height: 32px; width: 32px; object-fit: contain; }
    .page-info { font-size: 0.9rem; color: #64748b; font-weight: 500; }
    #content-container { flex: 1; position: relative; overflow: hidden; width: 100%; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
    footer { background: #fff; border-top: 1px solid #e2e8f0; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; height: 70px; box-sizing: border-box; }
    button { background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 8px; }
    button:disabled { background: #cbd5e1; cursor: not-allowed; opacity: 0.7; }
    button:hover:not(:disabled) { background: #c2410c; }
    button.secondary { background: #f1f5f9; color: #475569; }
    button.secondary:hover { background: #e2e8f0; }
    @media (max-width: 640px) {
      #app { box-shadow: none; }
      header { padding: 10px 16px; }
      footer { padding: 10px 16px; }
      .brand span { display: none; }
      .brand img { height: 36px; width: 36px; }
    }
  </style>
</head>
<body>
  <div id="app">
    <header>
      <div class="brand">
        <img src="${iconSrc}" alt="Logo">
        <span>${currentParams.subject} Lesson</span>
      </div>
      <div class="page-info">Page <span id="current-page">1</span> / <span id="total-pages">${pages.length}</span></div>
    </header>
    <div id="content-container"><iframe id="viewer" sandbox="allow-scripts allow-same-origin"></iframe></div>
    <footer>
      <button id="prev-btn" class="secondary" onclick="prevPage()">← Prev</button>
      <button id="next-btn" onclick="nextPage()">Next →</button>
    </footer>
  </div>
  <script>
    const pages = ${JSON.stringify(pages)};
    let currentIndex = 0;
    const viewer = document.getElementById('viewer');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNum = document.getElementById('current-page');
    function loadPage(index) {
      viewer.srcdoc = pages[index];
      pageNum.textContent = index + 1;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === pages.length - 1;
      nextBtn.innerHTML = index === pages.length - 1 ? 'Finish' : 'Next →';
    }
    function nextPage() { if (currentIndex < pages.length - 1) { currentIndex++; loadPage(currentIndex); } }
    function prevPage() { if (currentIndex > 0) { currentIndex--; loadPage(currentIndex); } }
    loadPage(0);
  </script>
</body>
</html>
    `;
    
    handleDownload(fullHtml, `Full_Lesson_${currentParams.loCode}.html`);
  };

  const renderPagination = (totalPages: number) => (
    <div className="flex justify-center items-center gap-4 mt-6 p-3 bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-md mx-auto relative">
        <button 
            onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-orange-600 transition-colors"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        
        <span className="font-medium text-gray-600 min-w-[100px] text-center">
            Page {currentPageIndex + 1} of {totalPages}
        </span>

        <button 
            onClick={() => setCurrentPageIndex(Math.min(totalPages - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === totalPages - 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-orange-600 transition-colors"
        >
            <ChevronRight className="w-6 h-6" />
        </button>

        <button 
            onClick={handleDeletePage}
            className="absolute right-3 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete this page"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
  );

  const renderContent = () => {
    if (!lessonData) return null;

    if (viewMode === ViewMode.EDIT) {
      return (
        <EditableView 
            blocks={lessonData.editable_blocks} 
            onRegenerate={handleRegenerateFromBlocks}
            onAiAssist={handleBlockAssist}
            isLoading={loading}
        />
      );
    }

    const regionalPages = lessonData.regional_html_pages;
    const englishPages = lessonData.english_html_pages;
    const totalPages = regionalPages.length;

    if (viewMode === ViewMode.SPLIT) {
        return (
            <div className="flex flex-col h-full w-full">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 justify-items-stretch items-start w-full">
                    {/* Regional Student View */}
                    <div className="flex flex-col w-full bg-orange-50/50 p-3 rounded-xl border border-orange-100 shadow-sm">
                        <div className="mb-3 flex items-center justify-between w-full px-1">
                            <div className="flex items-center gap-2 text-orange-700 font-bold text-sm uppercase tracking-wide">
                                <Smartphone className="w-4 h-4" /> Regional (Student)
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownload(regionalPages[currentPageIndex], `lesson-regional-page-${currentPageIndex + 1}.html`)}
                                    className="p-1.5 rounded hover:bg-orange-100 text-orange-600 transition-colors"
                                    title="Download HTML"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="h-[700px] w-full">
                             <HtmlPreview 
                                htmlContent={regionalPages[currentPageIndex]} 
                                title={`Student Page ${currentPageIndex + 1}`} 
                                isEditable={true}
                                onHtmlUpdate={(newHtml) => updateHtmlPage('regional', currentPageIndex, newHtml)}
                             />
                        </div>
                    </div>
                    
                    {/* English SME View */}
                    <div className="flex flex-col w-full bg-blue-50/50 p-3 rounded-xl border border-blue-100 shadow-sm">
                         <div className="mb-3 flex items-center justify-between w-full px-1">
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wide">
                                <UserCheck className="w-4 h-4" /> English (Review)
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownload(englishPages[currentPageIndex], `lesson-english-page-${currentPageIndex + 1}.html`)}
                                    className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition-colors"
                                    title="Download HTML"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="h-[700px] w-full">
                            <HtmlPreview 
                                htmlContent={englishPages[currentPageIndex]} 
                                title={`SME Page ${currentPageIndex + 1}`} 
                                isEditable={false}
                            />
                        </div>
                    </div>
                </div>
                {renderPagination(totalPages)}
            </div>
        );
    }

    // Single View Modes
    const pages = viewMode === ViewMode.REGIONAL ? regionalPages : englishPages;
    const colorClass = viewMode === ViewMode.REGIONAL ? "text-orange-700 bg-orange-50" : "text-blue-700 bg-blue-50";
    const label = viewMode === ViewMode.REGIONAL ? "Student View (Regional)" : "SME Review (English)";
    const filePrefix = viewMode === ViewMode.REGIONAL ? "lesson-regional" : "lesson-english";

    return (
      <div className="flex flex-col items-center h-full w-full max-w-5xl mx-auto">
         <div className={`mb-4 flex items-center gap-2 font-semibold px-4 py-1.5 rounded-full text-sm ${colorClass}`}>
            {viewMode === ViewMode.REGIONAL ? <Smartphone className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            {label}
         </div>
         <div className="w-full h-[700px]">
             <HtmlPreview 
                htmlContent={pages[currentPageIndex]} 
                title={`Page ${currentPageIndex + 1}`} 
                isEditable={viewMode === ViewMode.REGIONAL}
                onHtmlUpdate={viewMode === ViewMode.REGIONAL ? (newHtml) => updateHtmlPage('regional', currentPageIndex, newHtml) : undefined}
             />
        </div>
        
        <div className="flex items-center gap-3 mt-4">
            <button
                onClick={() => handleDownload(pages[currentPageIndex], `${filePrefix}-page-${currentPageIndex + 1}.html`)}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium transition-colors"
            >
                <Download className="w-4 h-4" /> Download Page
            </button>
        </div>

        {renderPagination(totalPages)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-lg shadow-md">
                <Layout className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-none hidden sm:block">
                ShikshaGen
                </h1>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">AI Lesson Creator</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             {viewMode !== ViewMode.FORM && lessonData && (
                 <button 
                 onClick={handleDownloadPlayable}
                 className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
               >
                 <PlayCircle className="w-4 h-4" /> 
                 Download Playable Lesson
               </button>
             )}

             {viewMode !== ViewMode.FORM && (
               <button 
                 onClick={() => {
                   setViewMode(ViewMode.FORM);
                   setLessonData(null);
                 }}
                 className="group flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-700 rounded-lg transition-all border border-transparent hover:border-orange-200"
               >
                 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                 <span className="font-medium hidden sm:inline">New Lesson</span>
                 <span className="font-medium sm:hidden">New</span>
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === ViewMode.FORM && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
             <div className="text-center mb-10 max-w-2xl px-4">
               <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-orange-600" />
               </div>
               <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Create CLT-Based Content</h2>
               <p className="text-base sm:text-lg text-gray-600">
                 Generate cognitive load theory compliant HTML lessons with Math & Algebra support for Indian students instantly.
               </p>
             </div>
             <div className="w-full px-4 sm:px-0">
                <InputForm onSubmit={handleGenerate} isLoading={loading} />
             </div>
             {error && (
               <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 max-w-2xl w-full mx-4">
                 <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                 <p className="text-sm">{error}</p>
               </div>
             )}
          </div>
        )}

        {viewMode !== ViewMode.FORM && lessonData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            {/* Sidebar / Navigation */}
            <div className="lg:col-span-2 lg:sticky lg:top-24 lg:h-fit space-y-6 order-2 lg:order-1">
               <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layout className="w-3 h-3" /> View Modes
                 </h3>
                 
                 <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                   <button 
                     onClick={() => setViewMode(ViewMode.SPLIT)}
                     className={`col-span-2 lg:col-span-1 w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.SPLIT ? 'bg-teal-50 text-teal-700 border border-teal-100 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     <Columns className="w-5 h-5 flex-shrink-0" />
                     <div className="flex flex-col">
                        <span className="text-sm">Parallel</span>
                     </div>
                   </button>

                   <div className="col-span-2 lg:col-span-1 w-full h-px bg-gray-100 my-1 lg:my-2 hidden lg:block"></div>

                   <button 
                     onClick={() => setViewMode(ViewMode.REGIONAL)}
                     className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.REGIONAL ? 'bg-orange-50 text-orange-700 border border-orange-100 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     <Smartphone className="w-5 h-5 flex-shrink-0" />
                     <span className="text-sm">Student</span>
                   </button>
                   
                   <button 
                     onClick={() => setViewMode(ViewMode.ENGLISH)}
                     className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.ENGLISH ? 'bg-blue-50 text-blue-700 border border-blue-100 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     <UserCheck className="w-5 h-5 flex-shrink-0" />
                     <span className="text-sm">Review</span>
                   </button>

                   <button 
                     onClick={() => setViewMode(ViewMode.EDIT)}
                     className={`col-span-2 lg:col-span-1 w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === ViewMode.EDIT ? 'bg-purple-50 text-purple-700 border border-purple-100 font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     <Edit3 className="w-5 h-5 flex-shrink-0" />
                     <span className="text-sm">Source</span>
                   </button>

                    {/* Mobile Only Download Button */}
                    <button 
                     onClick={handleDownloadPlayable}
                     className={`col-span-2 sm:hidden w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all bg-green-50 text-green-700 border border-green-100 font-medium`}
                   >
                     <PlayCircle className="w-5 h-5 flex-shrink-0" />
                     <span className="text-sm">Download Lesson</span>
                   </button>
                 </nav>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-10 min-h-[600px] order-1 lg:order-2">
               {renderContent()}
            </div>

            {/* Chat Assistant Toggle Button */}
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl border-2 border-white flex items-center justify-center hover:scale-110 hover:bg-orange-700 transition-all z-50"
                title="AI Assistant (Edit & Add Pages)"
            >
                {isChatOpen ? <span className="text-2xl font-bold">×</span> : <MessageSquare className="w-7 h-7" />}
            </button>

            {/* Chat Assistant Window */}
            <ChatAssistant 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                onModifyBlocks={handleChatModify}
                onAddPage={handleChatAddPage}
                isLoading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
