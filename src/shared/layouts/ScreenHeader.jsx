import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useSidebar } from '../../contexts/SidebarContext';

/**
 * Screen header component extracted from HomeScreen/components/Header.jsx
 * Provides consistent header across all screens
 */
const ScreenHeader = () => {
  const { navigate } = useNavigation();
  const { sidebarWidth } = useSidebar();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNewProject = () => {
    navigate('editor');
  };
  
  const handleRecord = () => {
    navigate('recordings');
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setPrompt('');
    setResponse('');
    setIsLoading(false);
  };

  const handleAskAI = async () => {
    if (!prompt.trim() || isLoading) return;
    try {
      setIsLoading(true);
      setResponse('');
      const result = await window.electronAPI.aiAssistScript({
        prompt,
        instructions: 'You are a helpful script writing assistant. Generate concise, production-ready code snippets with brief rationale for non-obvious choices.'
      });
      if (result && result.success) {
        setResponse(result.text || '');
      } else {
        setResponse(result?.error ? `Error: ${result.error}` : 'Unknown error');
      }
    } catch (err) {
      setResponse(`Error: ${err?.message || 'Failed to contact AI'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      className="bg-background-secondary border-b border-border flex items-center justify-between px-xl py-md flex-shrink-0"
    >
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search projects"
          className="w-full py-sm px-lg bg-background border border-border rounded-md text-text text-sm outline-none transition-colors duration-200 ease-in-out focus:border-primary"
        />
      </div>
      
      <div className="flex items-center gap-md">
        <button 
          className="py-sm px-lg bg-background-secondary border border-border rounded-md text-text text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-hover"
          onClick={handleNewProject}
        >
          New Project
        </button>
        <button 
          className="py-sm px-lg bg-primary border-none rounded-md text-text text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-primary-hover"
          onClick={handleRecord}
        >
          Record
        </button>
        
        <div className="w-px h-6 bg-border mx-sm" />
        
        <button 
          className="w-9 h-9 bg-transparent border-none rounded-md text-text-secondary text-base cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-hover"
          title="Help & Documentation"
        >
          <span className="text-lg font-semibold">?</span>
        </button>
        <button 
          className="w-9 h-9 bg-transparent border-none rounded-md text-text-secondary text-base cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-hover"
          title="Chat Support"
          onClick={handleOpenChat}
        >
          <span className="text-lg font-semibold">💬</span>
        </button>
        <button 
          className="w-9 h-9 bg-primary border-none rounded-full text-text text-sm font-semibold cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-primary-hover"
          title="Profile"
        >
          <span className="text-base">J</span>
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseChat} />
          <div className="relative z-[101] w-full max-w-lg bg-background border border-border rounded-lg shadow-xl p-lg">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-text text-base font-semibold">AI Script Assistant</h3>
              <button
                className="w-8 h-8 bg-transparent border-none rounded-md text-text-secondary cursor-pointer hover:bg-hover"
                onClick={handleCloseChat}
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-md">
              <textarea
                className="w-full min-h-[120px] text-sm bg-background border border-border rounded-md p-md text-text outline-none focus:border-primary"
                placeholder="Describe the script or snippet you need..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex items-center justify-end gap-sm">
                <button
                  className={`py-sm px-lg rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${isLoading ? 'bg-background-secondary text-text-secondary border border-border cursor-not-allowed' : 'bg-primary text-text hover:bg-primary-hover border-none cursor-pointer'}`}
                  onClick={handleAskAI}
                  disabled={isLoading}
                >
                  {isLoading ? 'Asking…' : 'Ask AI'}
                </button>
              </div>
              {response && (
                <div className="mt-sm max-h-60 overflow-auto bg-background-secondary border border-border rounded-md p-md text-sm whitespace-pre-wrap text-text">
                  {response}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenHeader;
