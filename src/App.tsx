import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { NoteModal } from './components/NoteModal';
import { IPhoneFrame } from './components/IPhoneFrame';
import { IPhoneTabBar, IPhoneTab } from './components/IPhoneTabBar';
import { PalaceView } from './components/PalaceView';
import { SessionsView } from './components/SessionsView';
import { ChatMessage, MindPalaceNote, ChatSession, SharedPalace, Language, CelebrityGuest } from './types';
import { 
  generateChatResponse, 
  extractMindPalaceData, 
  generateSummaryForSession, 
  isConcludingPhrase 
} from './services/geminiService';
import { detectGuestInvitation, buildInvitationWelcomePrompt } from './services/roundtableService';
import { 
  Bot, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Languages, 
  Smartphone, 
  Monitor, 
  BookOpen, 
  Sparkles,
  Share2,
  Users,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnalytics } from './hooks/useAnalytics';
import { useIsMobile } from './hooks/useIsMobile';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PrivacyModal } from './components/PrivacyModal';
import { PalaceExchangeModal } from './components/PalaceExchangeModal';
import { RoundtableModal } from './components/RoundtableModal';
import { translations } from './i18n';

export default function App() {
  useAnalytics();
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('appLang');
    return (saved as Language) || 'en';
  });
  const t = translations[lang];

  const isRealMobile = useIsMobile(768);
  // iPhone view mode - default to true as requested
  const [isIPhoneMode, setIsIPhoneMode] = useState(true);
  const showIPhoneLayout = isRealMobile || isIPhoneMode;
  const [activeTab, setActiveTab] = useState<IPhoneTab>('chat');

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isRoundtableModalOpen, setIsRoundtableModalOpen] = useState(false);
  const [exchangeInitialNoteIds, setExchangeInitialNoteIds] = useState<string[] | undefined>(undefined);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('custom_gemini_api_key') || '');
  
  const handleOpenExchange = (noteIds?: string[]) => {
    setExchangeInitialNoteIds(noteIds);
    setIsExchangeOpen(true);
  };
  
  const [notes, setNotes] = useState<MindPalaceNote[]>(() => {
    const saved = localStorage.getItem('mindPalaceNotes');
    return saved ? JSON.parse(saved) : [];
  });

  const [friendPalace, setFriendPalace] = useState<SharedPalace | null>(() => {
    const saved = localStorage.getItem('last_visited_friend_palace');
    return saved ? JSON.parse(saved) : null;
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chatSessions');
    if (saved) return JSON.parse(saved);
    
    const initialSession: ChatSession = {
      id: Date.now().toString(),
      title: t.newReadingSession,
      messages: [
        {
          id: Date.now().toString(),
          role: 'model',
          text: t.welcomeMessage,
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString(),
      summarized: false
    };
    return [initialSession];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || '';
  });

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [autoSummaryToast, setAutoSummaryToast] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<MindPalaceNote | null>(null);

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('mindPalaceNotes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  const showToast = (message: string, durationMs = 3500) => {
    setAutoSummaryToast(message);
    setTimeout(() => {
      setAutoSummaryToast((prev) => (prev === message ? null : prev));
    }, durationMs);
  };

  // Check URL query or hash for shared palace links (e.g. ?palace=PAL-7K9A)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let palaceCode = params.get('palace');
    if (!palaceCode && window.location.hash.includes('palace=')) {
      const match = window.location.hash.match(/palace=([a-zA-Z0-9_-]+)/);
      if (match) palaceCode = match[1];
    }

    if (palaceCode) {
      fetch(`/api/palace/${encodeURIComponent(palaceCode.trim())}`)
        .then(res => res.json())
        .then((data: SharedPalace) => {
          if (data && Array.isArray(data.notes) && data.notes.length > 0) {
            setFriendPalace(data);
            localStorage.setItem('last_visited_friend_palace', JSON.stringify(data));
            setActiveTab('palace');
            showToast(
              lang === 'zh'
                ? `已载入「${data.author}」的《${data.title}》（共${data.notes.length}条感悟）✨`
                : `Loaded "${data.title}" by ${data.author} (${data.notes.length} notes) ✨`,
              5000
            );
          }
        })
        .catch(err => {
          console.error("Failed to load palace from URL param:", err);
        });
    }
  }, [lang]);

  const handleLoadFriendPalace = (palace: SharedPalace) => {
    setFriendPalace(palace);
    localStorage.setItem('last_visited_friend_palace', JSON.stringify(palace));
    setActiveTab('palace');
    showToast(
      lang === 'zh'
        ? `已载入「${palace.author}」的记忆宫殿，欢迎漫步参观 🏛️`
        : `Loaded ${palace.author}'s Mind Palace, enjoy touring! 🏛️`,
      4000
    );
  };

  const handleClearFriendPalace = () => {
    setFriendPalace(null);
    localStorage.removeItem('last_visited_friend_palace');
  };

  const handleImportFriendNotes = (notesToImport: MindPalaceNote[]) => {
    const existingIds = new Set(notes.map(n => n.id));
    const newItems: MindPalaceNote[] = [];
    notesToImport.forEach(n => {
      if (!existingIds.has(n.id)) {
        newItems.push({
          ...n,
          id: Date.now().toString() + Math.random().toString(36).substring(2, 6)
        });
      }
    });

    if (newItems.length === 0) {
      showToast(lang === 'zh' ? '所选笔记已全部在您的宫殿中' : 'All selected notes are already in your palace');
      return;
    }

    const updated = [...newItems, ...notes];
    setNotes(updated);
    localStorage.setItem('mindPalaceNotes', JSON.stringify(updated));
    showToast(t.importSuccess.replace('{count}', newItems.length.toString()), 4000);
  };

  // Summarize session into the Mind Palace
  const handleSummarizeToPalace = useCallback(async (
    sessionId?: string, 
    triggerType: 'user_action' | 'timeout_2h' = 'user_action'
  ) => {
    const targetId = sessionId || currentSessionId;
    const targetSession = sessions.find(s => s.id === targetId) || currentSession;
    if (!targetSession) return;

    const hasUserMessages = targetSession.messages.some(m => m.role === 'user');
    if (!hasUserMessages) {
      showToast(t.cannotSummarizeEmpty);
      return;
    }

    setIsSummarizing(true);
    if (triggerType === 'timeout_2h') {
      showToast(t.autoSummarized2hNotice, 4500);
    }

    try {
      const summaryResponseText = await generateSummaryForSession(
        targetSession.messages,
        triggerType,
        lang,
        customApiKey,
        targetSession.roundtableGuests
      );

      const { data, cleanText } = extractMindPalaceData(summaryResponseText);

      let createdNoteId: string | undefined = undefined;

      if (data && data.action === 'saveToMindPalace') {
        const newNote: MindPalaceNote = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          bookTitle: data.bookTitle,
          chapter: data.chapter,
          summary: data.summary,
          takeaways: data.takeaways
        };
        createdNoteId = newNote.id;
        setNotes(prev => [newNote, ...prev]);
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cleanText,
        timestamp: new Date().toISOString()
      };

      const systemNoticeMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'model',
        text: triggerType === 'timeout_2h' 
          ? t.autoSummarized2hNotice 
          : t.saveSuccess.replace('{title}', data?.bookTitle || targetSession.title),
        timestamp: new Date().toISOString(),
        isSystem: true
      };

      setSessions(prev => prev.map(s => {
        if (s.id === targetId) {
          const updatedMessages = [...s.messages, modelMsg, systemNoticeMsg];
          const newTitle = (s.title === 'New Reading Session' || s.title === '新的阅读会话') && data?.bookTitle
            ? data.bookTitle
            : s.title;

          return {
            ...s,
            messages: updatedMessages,
            title: newTitle,
            lastUpdated: new Date().toISOString(),
            summarized: true,
            palaceNoteId: createdNoteId || s.palaceNoteId
          };
        }
        return s;
      }));

      if (triggerType === 'user_action') {
        showToast(t.saveSuccess.replace('{title}', data?.bookTitle || targetSession.title));
      }
    } catch (error: any) {
      console.error("Error summarizing session:", error);
      if (error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('API key')) {
        setIsApiKeyModalOpen(true);
      } else {
        showToast(t.generalError);
      }
    } finally {
      setIsSummarizing(false);
    }
  }, [currentSessionId, sessions, currentSession, lang, customApiKey, t]);

  // 2-Hour Inactivity Auto-Summarization monitor
  useEffect(() => {
    const checkInactivity = () => {
      const twoHoursMs = 2 * 60 * 60 * 1000;
      const now = Date.now();

      const staleSession = sessions.find(s => 
        !s.summarized &&
        s.messages.some(m => m.role === 'user') &&
        (now - new Date(s.lastUpdated).getTime() >= twoHoursMs)
      );

      if (staleSession && !isLoading && !isSummarizing) {
        console.log(`Auto-summarizing stale session ${staleSession.id} after 2h inactivity`);
        handleSummarizeToPalace(staleSession.id, 'timeout_2h');
      }
    };

    const timer = setTimeout(checkInactivity, 2000);
    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [sessions, isLoading, isSummarizing, handleSummarizeToPalace]);

  const handleInviteGuest = async (guest: CelebrityGuest) => {
    const targetSession = sessions.find(s => s.id === currentSessionId) || currentSession;
    if (!targetSession) return;
    const existing = targetSession.roundtableGuests || [];
    if (existing.some(g => g.id === guest.id)) return;

    const updatedGuests = [...existing, guest];
    const bookTitle = (targetSession.title !== 'New Reading Session' && targetSession.title !== '新的阅读会话') 
      ? targetSession.title 
      : '';
    const invitePrompt = buildInvitationWelcomePrompt(guest, bookTitle, lang);

    const systemNotice: ChatMessage = {
      id: Date.now().toString(),
      role: 'model',
      text: `✨ ${t.invitedToast.replace('{name}', lang === 'zh' ? guest.name : guest.nameEn)}`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    const userBroadcastMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'user',
      text: invitePrompt,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...targetSession.messages, systemNotice, userBroadcastMsg];

    setSessions(prev => prev.map(s => 
      s.id === currentSessionId
        ? { ...s, messages: newMessages, roundtableGuests: updatedGuests, lastUpdated: new Date().toISOString() }
        : s
    ));

    showToast(t.invitedToast.replace('{name}', lang === 'zh' ? guest.name : guest.nameEn));
    setIsLoading(true);

    try {
      const responseText = await generateChatResponse(newMessages, customApiKey, updatedGuests, lang);
      const { data, cleanText } = extractMindPalaceData(responseText);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'model',
        text: cleanText,
        timestamp: new Date().toISOString()
      };

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId
          ? { ...s, messages: [...newMessages, modelMsg], lastUpdated: new Date().toISOString() }
          : s
      ));
    } catch (err: any) {
      console.error("Failed to generate roundtable response", err);
      if (err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('API key')) {
        setIsApiKeyModalOpen(true);
      } else {
        showToast(t.generalError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGuest = (guestId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const guest = s.roundtableGuests?.find(g => g.id === guestId);
        const remaining = (s.roundtableGuests || []).filter(g => g.id !== guestId);
        const leaveNotice: ChatMessage = {
          id: Date.now().toString(),
          role: 'model',
          text: `🚪 ${t.removedToast.replace('{name}', guest ? (lang === 'zh' ? guest.name : guest.nameEn) : '')}`,
          timestamp: new Date().toISOString(),
          isSystem: true
        };
        return {
          ...s,
          roundtableGuests: remaining,
          messages: [...s.messages, leaveNotice],
          lastUpdated: new Date().toISOString()
        };
      }
      return s;
    }));
  };

  const handleResetToOneOnOne = () => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId && s.roundtableGuests && s.roundtableGuests.length > 0) {
        const switchNotice: ChatMessage = {
          id: Date.now().toString(),
          role: 'model',
          text: lang === 'zh' ? '📖 已切换回 1 对 1 深度共读模式' : '📖 Switched back to 1-on-1 reading mode',
          timestamp: new Date().toISOString(),
          isSystem: true
        };
        return {
          ...s,
          roundtableGuests: [],
          messages: [...s.messages, switchNotice],
          lastUpdated: new Date().toISOString()
        };
      }
      return s;
    }));
    showToast(lang === 'zh' ? '已切换回 1对1 共读' : 'Switched back to 1-on-1');
  };

  const handleSendMessage = async (text: string) => {
    // Detect concluding phrases to inform the user
    if (isConcludingPhrase(text)) {
      showToast(t.concludingDetected, 4000);
    }

    const targetSession = sessions.find(s => s.id === currentSessionId) || currentSession;
    const currentGuests = targetSession?.roundtableGuests || [];
    const detectedGuest = detectGuestInvitation(text, currentGuests);
    const activeGuests = detectedGuest ? [...currentGuests, detectedGuest] : currentGuests;

    if (detectedGuest) {
      showToast(t.invitedToast.replace('{name}', lang === 'zh' ? detectedGuest.name : detectedGuest.nameEn));
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMsg];
    
    // Update current session messages immediately
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId 
        ? { 
            ...s, 
            messages: newMessages, 
            roundtableGuests: activeGuests,
            lastUpdated: new Date().toISOString() 
          } 
        : s
    ));
    
    setIsLoading(true);

    try {
      const responseText = await generateChatResponse(newMessages, customApiKey, activeGuests, lang);
      const { data, cleanText } = extractMindPalaceData(responseText);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cleanText,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...newMessages, modelMsg];
      
      let createdNoteId: string | undefined = undefined;

      if (data && data.action === 'saveToMindPalace') {
        const newNote: MindPalaceNote = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          bookTitle: data.bookTitle,
          chapter: data.chapter,
          summary: data.summary,
          takeaways: data.takeaways
        };
        createdNoteId = newNote.id;
        setNotes(prev => [newNote, ...prev]);
        
        // Add a system message to indicate saving
        updatedMessages.push({
          id: (Date.now() + 2).toString(),
          role: 'model',
          text: t.saveSuccess.replace('{title}', data.bookTitle),
          timestamp: new Date().toISOString(),
          isSystem: true
        });

        showToast(t.saveSuccess.replace('{title}', data.bookTitle));
      }

      // Update session with model response, title, and summarized state if applicable
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          let title = s.title;
          if ((s.title === 'New Reading Session' || s.title === '新的阅读会话') && data?.bookTitle) {
            title = data.bookTitle;
          }
          return { 
            ...s, 
            messages: updatedMessages, 
            title, 
            lastUpdated: new Date().toISOString(),
            summarized: data?.action === 'saveToMindPalace' ? true : s.summarized,
            palaceNoteId: createdNoteId || s.palaceNoteId
          };
        }
        return s;
      }));
    } catch (error: any) {
      console.error("Error generating response:", error);
      
      if (error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('API key')) {
        setIsApiKeyModalOpen(true);
      } else {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId 
            ? { 
                ...s, 
                messages: [...s.messages, {
                  id: Date.now().toString(),
                  role: 'model',
                  text: t.generalError,
                  timestamp: new Date().toISOString(),
                  isSystem: true
                }] 
              } 
            : s
        ));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('custom_gemini_api_key', key);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: t.newReadingSession,
      messages: [
        {
          id: Date.now().toString(),
          role: 'model',
          text: t.welcomeMessage,
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString(),
      summarized: false
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveTab('chat');
  };

  const deleteSession = (id: string) => {
    if (sessions.length <= 1) {
      alert(t.deleteSessionError);
      return;
    }
    if (window.confirm(t.deleteConfirm)) {
      const newSessions = sessions.filter(s => s.id !== id);
      setSessions(newSessions);
      if (currentSessionId === id) {
        setCurrentSessionId(newSessions[0].id);
      }
    }
  };

  const openNoteForCurrentSession = () => {
    if (currentSession?.palaceNoteId) {
      const note = notes.find(n => n.id === currentSession.palaceNoteId);
      if (note) {
        setSelectedNote(note);
        return;
      }
    }
    setActiveTab('palace');
  };

  return (
    <div className={`relative w-full ${isRealMobile ? 'fixed inset-0 h-full h-[100dvh] overflow-hidden' : 'min-h-screen bg-stone-950'} font-sans`}>
      {/* Viewport Mode Switcher (discreet floating control on desktop only) */}
      {!isRealMobile && (
        <div className="hidden sm:flex fixed top-3 right-3 z-50 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-full p-1 shadow-lg items-center gap-1 text-xs">
          <button
            onClick={() => setIsIPhoneMode(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
              isIPhoneMode ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-stone-400 hover:text-stone-200'
            }`}
            title="iPhone 15/16 Pro 尺寸 (393 × 852)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.iphoneView}</span>
          </button>
          <button
            onClick={() => setIsIPhoneMode(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
              !isIPhoneMode ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-stone-400 hover:text-stone-200'
            }`}
            title="全宽桌面视图"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>{t.fullscreenView}</span>
          </button>
        </div>
      )}

      {showIPhoneLayout ? (
        /* iPhone Aspect Ratio Container (Edge-to-edge on mobile, sleek frame on desktop) */
        <IPhoneFrame isIPhoneMode={true} isRealMobile={isRealMobile}>
          {/* Toast Notification for Auto-Summarize & Concluding Remarks */}
          <AnimatePresence>
            {autoSummaryToast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`absolute ${isRealMobile ? 'top-16' : 'top-14'} left-3 right-3 z-50 bg-stone-900/95 text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border border-stone-700/60 flex items-center gap-2.5 pointer-events-none`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="leading-snug text-[11px] sm:text-xs flex-1">{autoSummaryToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* iOS Top Navigation Header */}
          <header className={`bg-white/95 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between px-3.5 shrink-0 z-20 ${isRealMobile ? 'pt-safe pb-2 min-h-[52px]' : 'h-12'}`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h1 className="font-serif font-semibold text-stone-800 text-xs sm:text-sm truncate">
                  {t.appName}
                </h1>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="h-8 px-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-semibold leading-none flex items-center justify-center transition-colors"
                title="Switch Language"
              >
                <span className="uppercase tracking-wider">{lang}</span>
              </button>

              <button 
                onClick={() => setIsRoundtableModalOpen(true)}
                className={`h-8 px-2 rounded-lg text-xs leading-none flex items-center justify-center transition-colors ${
                  (currentSession?.roundtableGuests?.length || 0) > 0
                    ? 'text-indigo-700 bg-indigo-50 border border-indigo-200 font-medium'
                    : 'text-stone-600 hover:text-indigo-700 hover:bg-indigo-50/50'
                }`}
                title={t.roundtableTitle}
              >
                <Users className="w-4 h-4" />
              </button>

              <button 
                onClick={() => handleOpenExchange()}
                className="h-8 px-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs leading-none flex items-center justify-center transition-colors"
                title={t.palaceExchangeTitle}
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsPrivacyOpen(true)}
                className="h-8 px-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs leading-none flex items-center justify-center transition-colors"
                title={t.privacy}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="h-8 px-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs leading-none flex items-center justify-center transition-colors"
                title={t.settings}
              >
                <Settings className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsStatsOpen(true)}
                className="h-8 px-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs leading-none flex items-center justify-center transition-colors"
                title={t.stats}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Tab Content Display */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {activeTab === 'chat' && (
              <>
                {/* Active Session Info Bar */}
                <div className="h-8 bg-stone-50/80 border-b border-stone-200/80 px-3.5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-500 shrink-0" />
                    <span className="text-xs font-medium text-stone-700 truncate leading-none">
                      {currentSession?.title || t.newReadingSession}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {currentSession?.summarized ? (
                      <button
                        onClick={openNoteForCurrentSession}
                        className="h-6 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/80 rounded-md text-xs font-medium leading-none inline-flex items-center gap-1 transition-colors shadow-2xs"
                        title={lang === 'zh' ? '查看已收录书签笔记' : 'View saved bookmark'}
                      >
                        <Bookmark className="w-3 h-3 fill-amber-600 text-amber-600" />
                        <span>{lang === 'zh' ? '已收录' : 'Saved'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSummarizeToPalace()}
                        disabled={isLoading || isSummarizing || !currentSession?.messages.some(m => m.role === 'user')}
                        className="h-6 px-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-md text-xs font-medium leading-none inline-flex items-center gap-1 transition-all shadow-2xs disabled:opacity-40"
                        title={t.summarizeToPalace}
                      >
                        <Sparkles className="w-3 h-3 text-white" />
                        <span>{t.cmdSummarize}</span>
                      </button>
                    )}

                    <button
                      onClick={createNewSession}
                      className="h-6 px-2 bg-white hover:bg-indigo-50/70 text-stone-700 hover:text-indigo-700 border border-stone-200 hover:border-indigo-200 rounded-md text-xs font-medium leading-none inline-flex items-center gap-1 transition-colors"
                      title={t.newSession}
                    >
                      <Plus className="w-3 h-3 text-stone-500" />
                      <span>{lang === 'zh' ? '新共读' : 'New'}</span>
                    </button>
                  </div>
                </div>

                {/* Chat Area */}
                <ChatArea 
                  messages={messages} 
                  onSendMessage={handleSendMessage} 
                  onSummarizeToPalace={() => handleSummarizeToPalace()}
                  isLoading={isLoading} 
                  isSummarizing={isSummarizing}
                  isSummarized={currentSession?.summarized}
                  onViewPalaceNote={openNoteForCurrentSession}
                  lang={lang}
                  roundtableGuests={currentSession?.roundtableGuests || []}
                  onOpenRoundtableModal={() => setIsRoundtableModalOpen(true)}
                  onRemoveGuest={handleRemoveGuest}
                  onResetToOneOnOne={handleResetToOneOnOne}
                />
              </>
            )}

            {activeTab === 'palace' && (
              <PalaceView
                notes={notes}
                onSelectNote={setSelectedNote}
                lang={lang}
                onOpenExchange={handleOpenExchange}
                friendPalace={friendPalace}
                onClearFriendPalace={handleClearFriendPalace}
                onImportFriendNotes={handleImportFriendNotes}
              />
            )}

            {activeTab === 'sessions' && (
              <SessionsView
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={setCurrentSessionId}
                onDeleteSession={deleteSession}
                onCreateNewSession={createNewSession}
                onSwitchToChat={() => setActiveTab('chat')}
                lang={lang}
              />
            )}
          </div>

          {/* iOS Bottom Tab Bar */}
          <IPhoneTabBar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            notesCount={notes.length}
            sessionsCount={sessions.length}
            lang={lang}
          />
        </IPhoneFrame>
      ) : (
        /* Fullscreen Desktop Mode fallback */
        <div className="flex h-screen w-full bg-stone-100 overflow-hidden font-sans">
          <Sidebar 
            notes={notes} 
            onSelectNote={setSelectedNote} 
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={setCurrentSessionId}
            onDeleteSession={deleteSession}
            lang={lang}
            onOpenExchange={handleOpenExchange}
          />
          
          <main className="flex-1 flex flex-col h-full relative">
            <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-medium text-stone-900 text-sm leading-tight">{t.headerTitle}</h2>
                  <p className="text-xs text-stone-400 leading-tight">{t.headerSubtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                  className="h-8 px-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium leading-none flex items-center gap-1.5 transition-colors"
                  title="Switch Language"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider font-semibold">{lang}</span>
                </button>
                <button 
                  onClick={() => setIsRoundtableModalOpen(true)}
                  className={`h-8 px-2.5 rounded-lg text-xs font-medium leading-none flex items-center gap-1.5 transition-colors ${
                    (currentSession?.roundtableGuests?.length || 0) > 0
                      ? 'bg-stone-100 text-stone-900 border border-stone-300'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-transparent'
                  }`}
                  title={t.roundtableTitle}
                >
                  <Users className="w-3.5 h-3.5 text-stone-600" />
                  <span>
                    {(currentSession?.roundtableGuests?.length || 0) > 0
                      ? `${t.roundtableActive} (${currentSession?.roundtableGuests?.length})`
                      : t.inviteCelebrity}
                  </span>
                </button>
                
                <button 
                  onClick={() => handleOpenExchange()}
                  className="h-8 px-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium leading-none flex items-center gap-1.5 transition-colors"
                  title={t.palaceExchangeTitle}
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>{t.exchangePalace}</span>
                </button>
                <button 
                  onClick={() => setIsPrivacyOpen(true)}
                  className="h-8 px-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium leading-none flex items-center gap-1.5 transition-colors"
                  title={t.privacy}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.privacy}</span>
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="h-8 px-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium leading-none flex items-center gap-1.5 transition-colors"
                  title={t.settings}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{t.settings}</span>
                </button>
                <button 
                  onClick={() => setIsStatsOpen(true)}
                  className="h-8 px-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-medium leading-none flex items-center gap-1.5 transition-colors"
                  title={t.stats}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{t.stats}</span>
                </button>
                
                <div className="w-px h-6 bg-stone-200 mx-2" />
                
                {currentSession?.summarized ? (
                  <button 
                    onClick={openNoteForCurrentSession}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/80 rounded-xl text-xs font-medium transition-all shadow-2xs"
                    title={lang === 'zh' ? '查看已收录书签笔记' : 'View saved bookmark'}
                  >
                    <Bookmark className="w-4 h-4 fill-amber-600 text-amber-600" />
                    <span>{lang === 'zh' ? '书签已收录' : 'Bookmarked'}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSummarizeToPalace()}
                    disabled={isLoading || isSummarizing || !currentSession?.messages.some(m => m.role === 'user')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-medium transition-all shadow-2xs disabled:opacity-40"
                    title={t.summarizeToPalace}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{t.summarizeToPalace}</span>
                  </button>
                )}

                <button 
                  onClick={createNewSession}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                  title={t.newSession}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </header>
            
            <div className="flex-1 overflow-hidden">
              <ChatArea 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                onSummarizeToPalace={() => handleSummarizeToPalace()}
                isLoading={isLoading} 
                isSummarizing={isSummarizing}
                isSummarized={currentSession?.summarized}
                onViewPalaceNote={openNoteForCurrentSession}
                lang={lang}
                roundtableGuests={currentSession?.roundtableGuests || []}
                onOpenRoundtableModal={() => setIsRoundtableModalOpen(true)}
                onRemoveGuest={handleRemoveGuest}
                onResetToOneOnOne={handleResetToOneOnOne}
              />
            </div>
          </main>
        </div>
      )}

      {/* Global Modals (rendered with native iOS bottom-sheet styling) */}
      {selectedNote && (
        <NoteModal 
          note={selectedNote} 
          onClose={() => setSelectedNote(null)} 
          lang={lang}
          customApiKey={customApiKey}
          onShareNote={(note) => handleOpenExchange([note.id])}
        />
      )}

      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} lang={lang} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        apiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
        lang={lang}
      />
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        onSave={(key) => {
          handleSaveApiKey(key);
          setIsApiKeyModalOpen(false);
        }} 
        lang={lang}
      />
      <PrivacyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
        lang={lang}
      />
      <PalaceExchangeModal 
        isOpen={isExchangeOpen}
        onClose={() => {
          setIsExchangeOpen(false);
          setExchangeInitialNoteIds(undefined);
        }}
        notes={notes}
        initialSelectedNoteIds={exchangeInitialNoteIds}
        onLoadFriendPalace={handleLoadFriendPalace}
        onImportNotes={handleImportFriendNotes}
        lang={lang}
      />

      <RoundtableModal 
        isOpen={isRoundtableModalOpen}
        onClose={() => setIsRoundtableModalOpen(false)}
        currentGuests={currentSession?.roundtableGuests || []}
        onInviteGuest={handleInviteGuest}
        onRemoveGuest={handleRemoveGuest}
        lang={lang}
      />
    </div>
  );
}
