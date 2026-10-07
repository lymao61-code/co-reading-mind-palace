import React from 'react';
import { ChatSession, Language } from '../types';
import { MessageSquare, Plus, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { translations } from '../i18n';
import { clsx } from 'clsx';

interface SessionsViewProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onCreateNewSession: () => void;
  onSwitchToChat: () => void;
  lang: Language;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onCreateNewSession,
  onSwitchToChat,
  lang
}) => {
  const t = translations[lang];

  const handleSessionClick = (id: string) => {
    onSelectSession(id);
    onSwitchToChat();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-100 overflow-hidden">
      {/* Top Header */}
      <div className="p-3.5 bg-white border-b border-stone-200/80 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="font-serif font-semibold text-stone-800 text-base">{t.allSessions}</h2>
          <p className="text-[11px] text-stone-500">{sessions.length} {lang === 'zh' ? '个对话记录' : 'sessions'}</p>
        </div>

        <button
          onClick={() => {
            onCreateNewSession();
            onSwitchToChat();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-medium shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.newSession}</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {sessions.map((session) => {
          const isActive = session.id === currentSessionId;
          const lastMsg = session.messages[session.messages.length - 1];

          return (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className={clsx(
                "p-3 rounded-2xl border transition-all cursor-pointer relative group",
                isActive 
                  ? "bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/20" 
                  : "bg-white/90 border-stone-200/80 hover:border-stone-300"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className={clsx(
                    "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs",
                    isActive ? "bg-indigo-100 text-indigo-600" : "bg-stone-100 text-stone-500"
                  )}>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-medium text-stone-800 text-xs truncate">
                    {session.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isActive && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {t.currentSession}
                    </span>
                  )}
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1 text-stone-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      title={t.deleteConfirm}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {lastMsg && (
                <p className="text-[11px] text-stone-500 line-clamp-1 mb-1.5 pl-7">
                  {lastMsg.text}
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-stone-400 pl-7 pt-1 border-t border-stone-100">
                <span>{session.messages.length} {lang === 'zh' ? '条对话' : 'messages'}</span>
                <span>
                  {session.lastUpdated ? format(new Date(session.lastUpdated), 'MM/dd HH:mm') : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
