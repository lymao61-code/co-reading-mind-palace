import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, CelebrityGuest } from '../types';
import { MessageBubble } from './MessageBubble';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Plus, 
  X, 
  Command, 
  ChevronUp, 
  ChevronDown,
  Quote,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { translations } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSummarizeToPalace: () => void;
  isLoading: boolean;
  isSummarizing?: boolean;
  isSummarized?: boolean;
  onViewPalaceNote?: () => void;
  lang: Language;
  roundtableGuests?: CelebrityGuest[];
  onOpenRoundtableModal?: () => void;
  onRemoveGuest?: (guestId: string) => void;
  onResetToOneOnOne?: () => void;
}

interface SlashCommand {
  key: string;
  aliases: string[];
  icon: string;
  label: string;
  desc: string;
  action: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  onSendMessage, 
  onSummarizeToPalace,
  isLoading, 
  isSummarizing,
  isSummarized,
  onViewPalaceNote,
  lang,
  roundtableGuests = [],
  onOpenRoundtableModal,
  onRemoveGuest,
  onResetToOneOnOne
}) => {
  const [input, setInput] = useState('');
  const [isQuickPanelOpen, setIsQuickPanelOpen] = useState(false);
  const [slashMenuIndex, setSlashMenuIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isSummarizing]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K for Roundtable, Esc to close menus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenRoundtableModal?.();
      } else if (e.key === 'Escape') {
        setIsQuickPanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenRoundtableModal]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !isLoading && !isSummarizing) {
      onSendMessage(input.trim());
      setInput('');
      setIsQuickPanelOpen(false);
    }
  };

  const handleExecutePrompt = (promptText: string) => {
    if (!isLoading && !isSummarizing) {
      onSendMessage(promptText);
      setIsQuickPanelOpen(false);
    }
  };

  const hasUserMessages = messages.some(m => m.role === 'user');
  const isRoundtableActive = roundtableGuests.length > 0;

  // Slash commands definitions
  const slashCommands: SlashCommand[] = [
    {
      key: 'socrates',
      aliases: ['/苏格拉底', '/socrates', '/s'],
      icon: '🏛️',
      label: lang === 'zh' ? '邀请苏格拉底' : 'Invite Socrates',
      desc: lang === 'zh' ? '以产婆术质疑前提，探讨本质' : 'Socratic questioning on core definitions',
      action: () => handleExecutePrompt(lang === 'zh' ? '我想邀请苏格拉底一起讨论' : 'I want to invite Socrates to discuss')
    },
    {
      key: 'wang',
      aliases: ['/王阳明', '/wang', '/w'],
      icon: '🌿',
      label: lang === 'zh' ? '邀请王阳明' : 'Invite Wang Yangming',
      desc: lang === 'zh' ? '从心即理与知行合一视角启发' : 'Explore unity of knowing and action',
      action: () => handleExecutePrompt(lang === 'zh' ? '请王阳明先生从心学和知行合一的角度来聊聊' : 'Invite Wang Yangming to discuss Heart philosophy')
    },
    {
      key: 'ted',
      aliases: ['/特德姜', '/ted', '/t'],
      icon: '🚀',
      label: lang === 'zh' ? '邀请特德·姜' : 'Invite Ted Chiang',
      desc: lang === 'zh' ? '思维实验与人性终极推演' : 'Thought experiments and philosophical sci-fi',
      action: () => handleExecutePrompt(lang === 'zh' ? '叫特德·姜从思想实验和科幻哲思来探讨' : 'Invite Ted Chiang for thought experiments')
    },
    {
      key: 'author',
      aliases: ['/作者', '/author', '/a'],
      icon: '✍️',
      label: lang === 'zh' ? '邀请原著作者' : 'Invite Book Author',
      desc: lang === 'zh' ? '以第一视角诉说创作初衷与深意' : 'Hear author perspective on the book',
      action: () => handleExecutePrompt(lang === 'zh' ? '我想请本书作者本人加入我们的圆桌' : 'Invite the original author to join')
    },
    {
      key: 'roundtable',
      aliases: ['/圆桌', '/table', '/r'],
      icon: '👥',
      label: lang === 'zh' ? '管理圆桌席位' : 'Roundtable Seats',
      desc: lang === 'zh' ? '打开嘉宾邀请与管理弹窗' : 'Open Roundtable guest management',
      action: () => {
        setInput('');
        onOpenRoundtableModal?.();
      }
    },
    {
      key: 'save',
      aliases: ['/总结', '/save', '/p'],
      icon: '✨',
      label: lang === 'zh' ? '总结并存入宫殿' : 'Summarize & Save',
      desc: lang === 'zh' ? '萃取本轮共读核心心智模型' : 'Extract takeaways to Mind Palace',
      action: () => {
        setInput('');
        onSummarizeToPalace();
      }
    },
    {
      key: 'done',
      aliases: ['/收工', '/done', '/d'],
      icon: '☕',
      label: lang === 'zh' ? '今天就读到这里' : "That's all for today",
      desc: lang === 'zh' ? '告一段落，小结本日心得' : 'Conclude today session gently',
      action: () => handleExecutePrompt(lang === 'zh' ? '今天就读到这里' : "That's all for today")
    }
  ];

  // Check if user is typing a slash command
  const isTypingSlash = input.startsWith('/');
  const filteredSlashCommands = isTypingSlash
    ? slashCommands.filter(cmd => 
        cmd.aliases.some(alias => alias.toLowerCase().includes(input.toLowerCase())) ||
        cmd.label.toLowerCase().includes(input.slice(1).toLowerCase())
      )
    : [];

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTypingSlash && filteredSlashCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashMenuIndex(prev => (prev + 1) % filteredSlashCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashMenuIndex(prev => (prev - 1 + filteredSlashCommands.length) % filteredSlashCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredSlashCommands[slashMenuIndex] || filteredSlashCommands[0];
        if (selected) {
          setInput('');
          selected.action();
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-100 overflow-hidden relative">
      {/* Roundtable Active Status Banner */}
      {isRoundtableActive && (
        <div className="bg-indigo-50/70 backdrop-blur-xs border-b border-indigo-100 px-3.5 py-2 flex items-center justify-between shadow-2xs shrink-0 transition-all z-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="h-6 px-2 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold leading-none flex items-center gap-1 shrink-0 border border-indigo-200/60">
              <Users className="w-3 h-3 text-indigo-700" />
              <span>{t.roundtableActive}</span>
            </div>
            
            <div className="h-3.5 w-px bg-indigo-200 shrink-0"></div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-6 px-2.5 rounded-full bg-white text-stone-700 border border-indigo-200/70 flex items-center gap-1 text-xs font-medium leading-none shadow-2xs">
                <span>🎙️</span>
                <span>{t.tableHostName}</span>
              </span>

              {roundtableGuests.map((guest) => (
                <span
                  key={guest.id}
                  className="group h-6 pl-2.5 pr-1.5 rounded-full bg-white hover:bg-indigo-50 text-stone-800 border border-indigo-200/70 flex items-center gap-1 text-xs font-medium leading-none shrink-0 transition-colors shadow-2xs"
                >
                  <span>{guest.avatar}</span>
                  <span>{lang === 'zh' ? guest.name : guest.nameEn}</span>
                  {onRemoveGuest && (
                    <button
                      onClick={() => onRemoveGuest(guest.id)}
                      className="p-0.5 text-stone-400 hover:text-rose-600 rounded-full transition-colors ml-0.5"
                      title={t.leaveTable}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {onOpenRoundtableModal && (
            <button
              onClick={onOpenRoundtableModal}
              className="h-6 px-2 text-xs font-medium leading-none text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-full transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>{t.inviteNewGuest}</span>
            </button>
          )}
        </div>
      )}

      {/* Top Floating Bookmark Tag in Chat Area */}
      {isSummarized && (
        <div className="absolute top-2.5 right-4 z-20 pointer-events-auto animate-in fade-in duration-300">
          <button
            type="button"
            onClick={onViewPalaceNote}
            className="group relative flex items-center gap-1.5 pl-2.5 pr-3 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer border border-amber-400/60"
            title={lang === 'zh' ? '点击翻开记忆宫殿书签笔记' : 'Click to view Mind Palace bookmark'}
          >
            <Bookmark className="w-3.5 h-3.5 fill-white text-white" />
            <span className="text-xs font-semibold tracking-tight leading-none">
              {lang === 'zh' ? '已收录书签' : 'Bookmarked'}
            </span>
            <span className="text-[10px] bg-amber-600/90 group-hover:bg-amber-700 px-1.5 py-0.5 rounded-full text-amber-100 font-medium leading-none">
              {lang === 'zh' ? '翻开' : 'Open'}
            </span>
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {(isLoading || isSummarizing) && (
          <div className="flex justify-start mb-4">
            <div className="flex max-w-[85%] gap-2 flex-row">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-stone-100 text-stone-500 border border-stone-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl shadow-2xs text-sm leading-6 bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs flex items-center gap-2">
                {isSummarizing ? (
                  <div className="flex items-center gap-2 text-stone-700 font-medium">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                    <span>{t.summarizing}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* In-feed Bookmarked Palace Ribbon Card */}
        {isSummarized && (
          <div className="flex justify-center my-4 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              type="button"
              onClick={onViewPalaceNote}
              className="group relative flex items-center gap-3 py-2.5 px-4 rounded-xl bg-amber-50/95 hover:bg-amber-100/95 border border-amber-300/90 shadow-xs hover:shadow-sm text-left transition-all active:scale-[0.99] max-w-md w-full cursor-pointer"
            >
              {/* Bookmark Ribbon Notch Shape */}
              <div 
                className="w-8 h-9 bg-amber-500 group-hover:bg-amber-600 text-white rounded-t-sm shadow-xs flex flex-col items-center justify-center shrink-0 transition-colors"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 6px), 50% 100%, 0% calc(100% - 6px))' }}
              >
                <Bookmark className="w-4 h-4 fill-white text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 leading-none mb-1">
                  <span className="text-xs font-semibold text-amber-950">
                    {lang === 'zh' ? '已存入记忆宫殿' : 'Saved to Memory Palace'}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 leading-none">
                    {lang === 'zh' ? '阅读书签' : 'Bookmark'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800/80 leading-tight truncate">
                  {lang === 'zh' ? '本段共读心得已提炼成殿堂卡片，点击随时翻开' : 'Discussion crystallized. Click to open palace card.'}
                </p>
              </div>

              <div className="text-xs font-medium text-amber-700 flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                <span>{lang === 'zh' ? '翻开笔记' : 'Open Note'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Slash Command Floating Palette */}
      <AnimatePresence>
        {isTypingSlash && filteredSlashCommands.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-24 left-3 right-3 sm:left-6 sm:right-6 bg-white/98 backdrop-blur-md rounded-xl shadow-lg border border-stone-200 overflow-hidden z-30"
          >
            <div className="px-3 h-7 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-400 leading-none">
              <span className="font-medium text-indigo-700 flex items-center gap-1.5">
                <Command className="w-3 h-3 text-indigo-600" />
                {lang === 'zh' ? '快捷指令 (按 ↑↓ 选择，回车执行)' : 'Quick Commands (↑↓ to select, Enter to run)'}
              </span>
              <span className="text-stone-400">ESC</span>
            </div>
            <div className="p-1.5 max-h-56 overflow-y-auto space-y-0.5">
              {filteredSlashCommands.map((cmd, idx) => (
                <button
                  key={cmd.key}
                  onClick={() => {
                    setInput('');
                    cmd.action();
                  }}
                  className={`w-full h-9 flex items-center justify-between px-2.5 rounded-lg text-left transition-colors text-xs leading-none ${
                    idx === slashMenuIndex
                      ? 'bg-indigo-50 text-indigo-900 font-medium border-l-2 border-indigo-600'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cmd.icon}</span>
                    <span className="font-medium text-stone-800">{cmd.label}</span>
                    <span className="text-stone-400 font-normal hidden sm:inline">· {cmd.desc}</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-mono">
                    {cmd.aliases[0]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refined Quick Inspiration Tray */}
      <AnimatePresence>
        {isQuickPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="bg-white border-t border-stone-200 px-3.5 py-3 shadow-inner shrink-0 overflow-hidden z-20"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
              <span className="text-xs font-semibold text-indigo-800 flex items-center gap-1.5 leading-none">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.quickInspirations}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 hidden sm:inline leading-none">
                  {t.slashCommandsHint}
                </span>
                <button
                  onClick={() => setIsQuickPanelOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Structured Quiet Inspiration Rows */}
            <div className="space-y-2.5">
              {/* Thinker Invites */}
              <div>
                <div className="text-xs font-medium text-stone-400 mb-1.5 flex items-center gap-1.5 leading-none">
                  <span>🏛️</span>
                  <span>{lang === 'zh' ? '邀请名贤' : 'Invite Thinkers'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleExecutePrompt(lang === 'zh' ? '我想邀请苏格拉底一起讨论' : 'I want to invite Socrates to discuss')}
                    disabled={isLoading || isSummarizing}
                    className="h-7 px-2.5 bg-indigo-50/70 hover:bg-indigo-100/90 active:bg-indigo-200/80 text-indigo-900 rounded-lg border border-indigo-200 text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>🏛️</span>
                    <span>{lang === 'zh' ? '苏格拉底 · 产婆诘问' : 'Socrates · Questioning'}</span>
                  </button>

                  <button
                    onClick={() => handleExecutePrompt(lang === 'zh' ? '请王阳明先生从心学和知行合一的角度来聊聊' : 'Invite Wang Yangming to discuss Heart philosophy')}
                    disabled={isLoading || isSummarizing}
                    className="h-7 px-2.5 bg-indigo-50/70 hover:bg-indigo-100/90 active:bg-indigo-200/80 text-indigo-900 rounded-lg border border-indigo-200 text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>🌿</span>
                    <span>{lang === 'zh' ? '王阳明 · 知行合一' : 'Wang Yangming · Mind Philosophy'}</span>
                  </button>

                  <button
                    onClick={() => handleExecutePrompt(lang === 'zh' ? '叫特德·姜从思想实验和科幻哲思来探讨' : 'Invite Ted Chiang for thought experiments')}
                    disabled={isLoading || isSummarizing}
                    className="h-7 px-2.5 bg-indigo-50/70 hover:bg-indigo-100/90 active:bg-indigo-200/80 text-indigo-900 rounded-lg border border-indigo-200 text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>🚀</span>
                    <span>{lang === 'zh' ? '特德·姜 · 思想实验' : 'Ted Chiang · Thought Exp.'}</span>
                  </button>

                  <button
                    onClick={() => handleExecutePrompt(lang === 'zh' ? '我想请本书作者本人加入我们的圆桌' : 'Invite the original author to join')}
                    disabled={isLoading || isSummarizing}
                    className="h-7 px-2.5 bg-indigo-50/70 hover:bg-indigo-100/90 active:bg-indigo-200/80 text-indigo-900 rounded-lg border border-indigo-200 text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>✍️</span>
                    <span>{lang === 'zh' ? '原书作者 · 创作初衷' : 'Author · Perspective'}</span>
                  </button>
                </div>
              </div>

              {/* Conclude Session */}
              <div>
                <div className="text-xs font-medium text-stone-400 mb-1.5 flex items-center gap-1.5 leading-none">
                  <span>☕</span>
                  <span>{lang === 'zh' ? '阅读收尾' : 'Session Wrap-up'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleExecutePrompt(lang === 'zh' ? '今天就读到这里' : "That's all for today")}
                    disabled={isLoading || isSummarizing}
                    className="h-7 px-2.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/90 active:bg-indigo-200/80 text-indigo-900 border border-indigo-200 text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Quote className="w-3 h-3 text-indigo-500" />
                    <span>{t.todayDone}</span>
                  </button>
                  <button
                    onClick={() => handleExecutePrompt(lang === 'zh' ? '读完了，帮我存入宫殿' : 'Finished reading, save to palace')}
                    disabled={isLoading || isSummarizing}
                    className="h-7 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 active:bg-amber-200/80 text-amber-900 border border-amber-300/80 text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>{t.finishAndSave}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek Dock & Input Form */}
      <div className="bg-white border-t border-stone-200/80 shrink-0">
        {/* Dock Control Bar */}
        <div className="px-3.5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Inline Mode Switcher: 1-on-1 vs Roundtable */}
            <div className="inline-flex p-0.5 bg-stone-100 border border-stone-200/80 rounded-lg text-xs shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (isRoundtableActive && onResetToOneOnOne) {
                    onResetToOneOnOne();
                  }
                }}
                className={`h-6 px-2.5 rounded-md text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-all ${
                  !isRoundtableActive
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title={lang === 'zh' ? '1对1深度共读模式' : '1-on-1 Reading Mode'}
              >
                <span>📖</span>
                <span>{lang === 'zh' ? '1对1' : '1-on-1'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenRoundtableModal}
                className={`h-6 px-2.5 rounded-md text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-all ${
                  isRoundtableActive
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-indigo-700'
                }`}
                title={lang === 'zh' ? '思想圆桌研讨模式' : 'Roundtable Symposium'}
              >
                <span>👥</span>
                <span>{lang === 'zh' ? '圆桌' : 'Roundtable'}</span>
                {isRoundtableActive && roundtableGuests.length > 0 && (
                  <span className="h-3.5 px-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold inline-flex items-center leading-none">
                    {roundtableGuests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Inspiration Drawer Toggle */}
            <button
              onClick={() => setIsQuickPanelOpen(prev => !prev)}
              className={`h-7 px-2.5 rounded-lg text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors ${
                isQuickPanelOpen
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/70'
              }`}
              title={t.quickInspirations}
            >
              <Sparkles className="w-3 h-3" />
              <span>{t.quickInspirations}</span>
              {isQuickPanelOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3 opacity-60" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Summarize & Bookmark Pill */}
            {isSummarized ? (
              <button
                onClick={onViewPalaceNote}
                className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-300/80 text-xs font-medium leading-none hover:bg-amber-100 transition-colors shadow-2xs"
                title={lang === 'zh' ? '查看已收录书签笔记' : 'View saved bookmark'}
              >
                <Bookmark className="w-3 h-3 fill-amber-600 text-amber-600" />
                <span>{lang === 'zh' ? '书签已收录' : 'Bookmarked'}</span>
              </button>
            ) : (
              <button
                onClick={onSummarizeToPalace}
                disabled={isLoading || isSummarizing || !hasUserMessages}
                title={t.summarizeHint}
                className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-medium leading-none transition-all shadow-2xs disabled:opacity-40 disabled:pointer-events-none"
              >
                <Sparkles className="w-3 h-3 text-white" />
                <span>{t.cmdSummarize}</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-3 pt-0">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setSlashMenuIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={
                isRoundtableActive 
                  ? (lang === 'zh' ? '向圆桌研讨发言（输入 / 快捷指令）...' : 'Speak to the roundtable (type / for commands)...') 
                  : (lang === 'zh' ? '探讨心得、提问质疑（输入 / 快捷指令）...' : 'Discuss ideas, ask questions (type / for commands)...')
              }
              disabled={isLoading || isSummarizing}
              className="h-10 w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 rounded-xl py-2 pl-3.5 pr-11 text-sm leading-5 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isSummarizing}
              className="absolute right-1.5 h-7 w-7 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 flex items-center justify-center shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


