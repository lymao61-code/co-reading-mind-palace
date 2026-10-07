import React, { useState } from 'react';
import { MindPalaceNote, ChatSession, Language } from '../types';
import { BookOpen, Calendar, ChevronRight, MessageSquare, Trash2, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { translations } from '../i18n';

interface SidebarProps {
  notes: MindPalaceNote[];
  onSelectNote: (note: MindPalaceNote) => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  lang: Language;
  onOpenExchange?: (initialNoteIds?: string[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  notes, 
  onSelectNote, 
  sessions, 
  currentSessionId, 
  onSelectSession,
  onDeleteSession,
  lang,
  onOpenExchange
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'notes'>('chats');
  const t = translations[lang];

  return (
    <div className="w-80 bg-stone-50 border-r border-stone-200 h-full flex flex-col">
      <div className="p-6 border-b border-stone-200 bg-white shrink-0">
        <h1 className="text-2xl font-serif font-semibold text-stone-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          {t.appName}
        </h1>
        <p className="text-sm text-stone-500 mt-1">{t.appSubtitle}</p>
      </div>

      <div className="p-4 shrink-0">
        <div className="flex bg-stone-200/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('chats')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
              activeTab === 'chats' ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {t.chatsTab}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
              activeTab === 'notes' ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.notesTab}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="wait">
          {activeTab === 'notes' ? (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {notes.length === 0 ? (
                <div className="text-center text-stone-400 mt-10 text-sm">
                  <p>{t.noNotes}</p>
                  <p>{t.noNotesSub}</p>
                </div>
              ) : (
                notes.map((note) => (
                  <motion.div
                    key={note.id}
                    onClick={() => onSelectNote(note)}
                    className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-stone-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {note.bookTitle}
                      </h3>
                      <div className="flex items-center gap-1">
                        {onOpenExchange && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenExchange([note.id]);
                            }}
                            className="p-1 text-stone-300 hover:text-indigo-600 hover:bg-indigo-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                            title={t.shareThisNote}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 mb-3 line-clamp-1">{note.chapter}</p>
                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(note.date), 'MMM d, yyyy')}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chats"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-2"
            >
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={clsx(
                    "p-3 rounded-xl border transition-all cursor-pointer group flex items-center gap-3",
                    currentSessionId === session.id 
                      ? "bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-100" 
                      : "border-transparent hover:bg-stone-200/50"
                  )}
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    currentSessionId === session.id ? "bg-indigo-100 text-indigo-600" : "bg-stone-200 text-stone-500"
                  )}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={clsx(
                      "text-sm font-medium truncate",
                      currentSessionId === session.id ? "text-stone-900" : "text-stone-600"
                    )}>
                      {session.title}
                    </h3>
                    <p className="text-[10px] text-stone-400">
                      {format(new Date(session.lastUpdated), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {onOpenExchange && (
        <div className="p-3 bg-white border-t border-stone-200 shrink-0">
          <button
            onClick={() => onOpenExchange()}
            className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-medium border border-indigo-200/80 flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.palaceExchangeTitle}</span>
          </button>
        </div>
      )}
    </div>
  );
};
