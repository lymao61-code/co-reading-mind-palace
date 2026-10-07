import React from 'react';
import { MessageSquare, BookOpen, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { Language } from '../types';
import { translations } from '../i18n';

export type IPhoneTab = 'chat' | 'palace' | 'sessions';

interface IPhoneTabBarProps {
  activeTab: IPhoneTab;
  onTabChange: (tab: IPhoneTab) => void;
  notesCount: number;
  sessionsCount: number;
  lang: Language;
}

export const IPhoneTabBar: React.FC<IPhoneTabBarProps> = ({
  activeTab,
  onTabChange,
  notesCount,
  sessionsCount,
  lang
}) => {
  const t = translations[lang];

  return (
    <div className="bg-white/95 backdrop-blur-lg border-t border-stone-200/80 flex items-center justify-around px-2 z-30 shrink-0 min-h-[54px] pb-safe pt-1">
      {/* Chat Tab */}
      <button
        onClick={() => onTabChange('chat')}
        className={clsx(
          "flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95",
          activeTab === 'chat' ? "text-indigo-600 font-semibold" : "text-stone-400 hover:text-stone-600"
        )}
      >
        <div className="relative">
          <MessageSquare className={clsx("w-5 h-5", activeTab === 'chat' && "stroke-[2.2px]")} />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">{t.tabChat}</span>
      </button>

      {/* Palace Tab (Notes) */}
      <button
        onClick={() => onTabChange('palace')}
        className={clsx(
          "flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95",
          activeTab === 'palace' ? "text-indigo-600 font-semibold" : "text-stone-400 hover:text-stone-600"
        )}
      >
        <div className="relative">
          <BookOpen className={clsx("w-5 h-5", activeTab === 'palace' && "stroke-[2.2px]")} />
          {notesCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {notesCount > 99 ? '99+' : notesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">{t.tabPalace}</span>
      </button>

      {/* Sessions Tab */}
      <button
        onClick={() => onTabChange('sessions')}
        className={clsx(
          "flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95",
          activeTab === 'sessions' ? "text-indigo-600 font-semibold" : "text-stone-400 hover:text-stone-600"
        )}
      >
        <div className="relative">
          <Clock className={clsx("w-5 h-5", activeTab === 'sessions' && "stroke-[2.2px]")} />
          {sessionsCount > 1 && (
            <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-stone-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {sessionsCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">{t.tabHistory}</span>
      </button>
    </div>
  );
};
