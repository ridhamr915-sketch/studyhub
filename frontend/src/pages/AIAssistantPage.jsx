import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FolderArchive,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  RefreshCw,
  Plus,
  MessageSquare
} from 'lucide-react';
import { api } from '../lib/api';

const SUGGESTED_QUESTIONS = [
  "Explain linked lists in simple language.",
  "What is the difference between stack and queue?",
  "Explain the important topics in Unit 1.",
  "Give an example of polymorphism."
];

export default function AIAssistantPage() {
  const [searchParams] = useSearchParams();
  const initialResourceId = searchParams.get('resource_id') || '';

  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(initialResourceId);
  const [selectedResource, setSelectedResource] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (initialResourceId && resources.length > 0) {
      setSelectedResourceId(initialResourceId);
      const res = resources.find(r => r.id === initialResourceId);
      if (res) setSelectedResource(res);
    }
  }, [initialResourceId, resources]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadInitialData = async () => {
    try {
      const [resData, sessData, statusData] = await Promise.all([
        api.getResources().catch(() => []),
        api.getAssistantSessions().catch(() => []),
        api.getAssistantStatus().catch(() => null)
      ]);
      setResources(resData);
      setSessions(sessData);
      setAiStatus(statusData);

      if (initialResourceId) {
        const found = resData.find(r => r.id === initialResourceId);
        if (found) setSelectedResource(found);
      }

      // Welcome initial message
      setMessages([
        {
          role: 'assistant',
          content: `👋 **Hello! I am your StudyHub AI Study Assistant.**\n\nI can help you understand engineering concepts, analyze your uploaded lecture PDFs, and prepare model answers for your university exams.\n\nSelect a PDF on the left to ask questions directly grounded in your document, or pick one of the sample questions below to get started!`,
          sources: [{ type: 'system', name: 'StudyHub Academic Tutor' }]
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResourceChange = (resId) => {
    setSelectedResourceId(resId);
    const found = resources.find(r => r.id === resId);
    setSelectedResource(found || null);
    if (found) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `📄 **Attached Resource:** *${found.title}* (${found.file_name})\n\nI am now analyzing this document. Ask any question about its topics, formulas, or summaries!`,
          sources: [{ type: 'document', name: found.title }]
        }
      ]);
    }
  };

  const handleSendMessage = async (questionText = inputQuestion) => {
    const q = questionText.trim();
    if (!q || loading) return;

    setInputQuestion('');
    
    // Add user message to UI
    const userMsg = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history for conversational context
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await api.askAssistant({
        session_id: currentSessionId || undefined,
        resource_id: selectedResourceId || undefined,
        question: q,
        history: history
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.content,
          sources: response.sources || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Error:** Unable to complete response: ${err.message}. Please check your connection or try again.`,
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
      {/* Left Sidebar: PDF Document Selector & Sessions */}
      <div className="w-full md:w-80 shrink-0 flex flex-col bg-white rounded-3xl border border-[#EDE9FE] shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#EDE9FE] bg-[#F8F7FF]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#7C3AED]" />
            <h3 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Document Context</h3>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED]">
            {aiStatus?.model || 'Gemini 1.5'}
          </span>
        </div>

        {/* Resource Selection */}
        <div className="p-4 border-b border-[#EDE9FE] space-y-2">
          <label className="block text-xs font-semibold text-[#4B5563]">Active Study PDF:</label>
          <select
            value={selectedResourceId}
            onChange={(e) => handleResourceChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
          >
            <option value="">-- No Document (General Knowledge) --</option>
            {resources.map(r => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.file_type?.toUpperCase()})
              </option>
            ))}
          </select>

          {selectedResource && (
            <div className="mt-2 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-[11px] text-[#4B5563]">
              <p className="font-bold text-[#7C3AED] truncate">{selectedResource.title}</p>
              <p className="text-[#6B7280] truncate mt-0.5">
                {(selectedResource.file_size / 1024).toFixed(1)} KB • {selectedResource.file_name}
              </p>
            </div>
          )}
        </div>

        {/* Suggested Academic Prompts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
            Suggested Doubts
          </p>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="w-full text-left p-2.5 rounded-xl text-xs text-[#4B5563] hover:text-[#7C3AED] hover:bg-[#F8F7FF] border border-transparent hover:border-[#EDE9FE] transition-all flex items-start gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Reset Chat */}
        <div className="p-3 border-t border-[#EDE9FE] bg-[#F8F7FF]/50">
          <button
            onClick={() => {
              setMessages([]);
              loadInitialData();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#7C3AED] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Conversation</span>
          </button>
        </div>
      </div>

      {/* Center/Right: Chat Conversation Box */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-[#EDE9FE] shadow-xs overflow-hidden">
        {/* Chat Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={index}
                className={`flex gap-3 sm:gap-4 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isUser ? 'bg-[#7C3AED]' : 'bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA]'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#7C3AED] text-white rounded-tr-xs shadow-xs'
                    : 'bg-[#F8F7FF] text-[#1F2937] border border-[#EDE9FE] rounded-tl-xs shadow-xs'
                }`}>
                  <div className="whitespace-pre-wrap select-text prose prose-sm max-w-none">
                    {msg.content}
                  </div>

                  {/* Grounding Source Badge */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#EDE9FE] flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold text-[#9CA3AF]">Grounding:</span>
                      {msg.sources.map((s, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            s.type === 'document'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-purple-100 text-[#7C3AED]'
                          }`}
                        >
                          {s.type === 'document' ? <CheckCircle2 className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                          <span>{s.name || (s.type === 'document' ? 'Syllabus PDF' : 'Curriculum Engine')}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 items-center max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] text-xs text-[#6B7280] flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>StudyHub AI is reviewing your document context...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#EDE9FE] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={
                selectedResource
                  ? `Ask a question about ${selectedResource.title}...`
                  : "Ask any academic doubt (e.g. difference between stack and queue)..."
              }
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-[#F8F7FF] border border-[#EDE9FE] rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]"
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="px-5 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#7C3AED]/20 transition-all disabled:opacity-50"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
