import React from 'react';
import { ChatMessage } from '../types';
import { Bot, User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';

interface MessageBubbleProps {
  message: ChatMessage;
}

interface ParsedTurn {
  id: string;
  avatar: string;
  name: string;
  role: string;
  avatarBg: string;
  avatarText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  bubbleBorder: string;
  content: string;
}

const SPEAKER_METADATA: Record<string, {
  avatar: string;
  role: string;
  avatarBg: string;
  avatarText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  bubbleBorder: string;
}> = {
  '共读引导员': {
    avatar: '🎙️',
    role: '主持',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-700',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    bubbleBorder: 'border-violet-200/70'
  },
  '引导员': {
    avatar: '🎙️',
    role: '主持',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-700',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    bubbleBorder: 'border-violet-200/70'
  },
  '主持人': {
    avatar: '🎙️',
    role: '主持',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-700',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    bubbleBorder: 'border-violet-200/70'
  },
  'host': {
    avatar: '🎙️',
    role: 'Host',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-700',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    bubbleBorder: 'border-violet-200/70'
  },
  '苏格拉底': {
    avatar: '🏛️',
    role: '哲学产婆',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-800',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    bubbleBorder: 'border-amber-200/70'
  },
  'socrates': {
    avatar: '🏛️',
    role: 'Philosopher',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-800',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    bubbleBorder: 'border-amber-200/70'
  },
  '王阳明': {
    avatar: '🌿',
    role: '知行合一',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-800',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    bubbleBorder: 'border-emerald-200/70'
  },
  '阳明': {
    avatar: '🌿',
    role: '知行合一',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-800',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    bubbleBorder: 'border-emerald-200/70'
  },
  '特德·姜': {
    avatar: '🚀',
    role: '思想实验',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-800',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    bubbleBorder: 'border-indigo-200/70'
  },
  '特德姜': {
    avatar: '🚀',
    role: '思想实验',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-800',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    bubbleBorder: 'border-indigo-200/70'
  },
  'ted chiang': {
    avatar: '🚀',
    role: 'Sci-Fi Thinker',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-800',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    bubbleBorder: 'border-indigo-200/70'
  },
  '本书作者本人': {
    avatar: '✍️',
    role: '原著作者',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-800',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    bubbleBorder: 'border-purple-200/70'
  },
  '本书作者': {
    avatar: '✍️',
    role: '原著作者',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-800',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    bubbleBorder: 'border-purple-200/70'
  },
  '作者本人': {
    avatar: '✍️',
    role: '原著作者',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-800',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    bubbleBorder: 'border-purple-200/70'
  },
  'author': {
    avatar: '✍️',
    role: 'Author',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-800',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    bubbleBorder: 'border-purple-200/70'
  },
  '查理·芒格': {
    avatar: '💡',
    role: '多元模型',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-900',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-200',
    bubbleBorder: 'border-amber-200/70'
  },
  '芒格': {
    avatar: '💡',
    role: '多元模型',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-900',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-200',
    bubbleBorder: 'border-amber-200/70'
  },
  '弗里德里希·尼采': {
    avatar: '⚡',
    role: '精神重估',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-800',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    bubbleBorder: 'border-rose-200/70'
  },
  '尼采': {
    avatar: '⚡',
    role: '精神重估',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-800',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    bubbleBorder: 'border-rose-200/70'
  },
  '理查德·费曼': {
    avatar: '⚛️',
    role: '第一性原理',
    avatarBg: 'bg-cyan-100',
    avatarText: 'text-cyan-800',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
    bubbleBorder: 'border-cyan-200/70'
  },
  '费曼': {
    avatar: '⚛️',
    role: '第一性原理',
    avatarBg: 'bg-cyan-100',
    avatarText: 'text-cyan-800',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
    bubbleBorder: 'border-cyan-200/70'
  },
  '孔子': {
    avatar: '📜',
    role: '儒学先师',
    avatarBg: 'bg-stone-200',
    avatarText: 'text-stone-800',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-800',
    badgeBorder: 'border-stone-300',
    bubbleBorder: 'border-stone-200'
  }
};

function parseRoundtableTurns(text: string): ParsedTurn[] | null {
  // Pattern matching: **Avatar Name**：or **Name**: or ### Avatar Name
  const pattern = /(?:^|\n+)(?:\*\*([^\*\n]+?)\*\*|###\s*([^\n]+?))[：:]\s*/g;
  const matches: { index: number; fullLength: number; header: string }[] = [];
  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    const header = (m[1] || m[2] || '').trim();
    if (header.length > 0 && header.length <= 30) {
      matches.push({
        index: m.index,
        fullLength: m[0].length,
        header
      });
    }
  }

  // Need at least 1 recognized speaker turn
  if (matches.length === 0) return null;

  // If only 1 match, verify it's a genuine speaker prefix
  if (matches.length === 1) {
    const header = matches[0].header;
    const hasKnown = Object.keys(SPEAKER_METADATA).some(k => header.toLowerCase().includes(k.toLowerCase()));
    if (!hasKnown && matches[0].index > 0) return null;
  }

  const turns: ParsedTurn[] = [];

  // If there is introductory text before the first speaker turn
  if (matches[0].index > 0) {
    const intro = text.substring(0, matches[0].index).trim();
    if (intro.length > 0) {
      turns.push({
        id: 'turn_intro',
        name: '共读引导员',
        avatar: '🎙️',
        role: '主持',
        avatarBg: 'bg-violet-100',
        avatarText: 'text-violet-700',
        badgeBg: 'bg-violet-50',
        badgeText: 'text-violet-700',
        badgeBorder: 'border-violet-200',
        bubbleBorder: 'border-violet-200/70',
        content: intro
      });
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const startIndex = current.index + current.fullLength;
    const endIndex = next ? next.index : text.length;
    const content = text.substring(startIndex, endIndex).trim();

    if (!content) continue;

    // Detect emoji in header
    const emojiMatch = current.header.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
    const foundEmoji = emojiMatch ? emojiMatch[1] : undefined;
    const cleanName = current.header
      .replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u, '')
      .replace(/[（(].*?[)）]/g, '')
      .trim();

    const matchedKey = Object.keys(SPEAKER_METADATA).find(k => 
      cleanName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(cleanName.toLowerCase())
    );
    const meta = matchedKey ? SPEAKER_METADATA[matchedKey] : null;

    turns.push({
      id: `turn_${i}_${cleanName}`,
      name: cleanName || current.header,
      avatar: foundEmoji || meta?.avatar || '✨',
      role: meta?.role || '特邀名贤',
      avatarBg: meta?.avatarBg || 'bg-indigo-100',
      avatarText: meta?.avatarText || 'text-indigo-800',
      badgeBg: meta?.badgeBg || 'bg-indigo-50',
      badgeText: meta?.badgeText || 'text-indigo-800',
      badgeBorder: meta?.badgeBorder || 'border-indigo-200',
      bubbleBorder: meta?.bubbleBorder || 'border-indigo-200/70',
      content
    });
  }

  return turns.length > 0 ? turns : null;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.isSystem;

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-indigo-50/90 text-indigo-700 text-xs leading-none h-6 px-3 rounded-full border border-indigo-200/70 flex items-center gap-1.5 shadow-2xs font-medium">
          {message.text}
        </div>
      </div>
    );
  }

  // Check if this model message contains multiple roundtable guest turns
  if (!isUser) {
    const turns = parseRoundtableTurns(message.text);
    if (turns && turns.length > 0) {
      return (
        <div className="w-full space-y-3 mb-4">
          {turns.map((turn) => (
            <div key={turn.id} className="flex gap-2.5 items-start">
              {/* Individual Thinker Avatar */}
              <div 
                className={twMerge(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border shadow-2xs select-none transition-transform hover:scale-105",
                  turn.avatarBg,
                  turn.avatarText,
                  turn.badgeBorder
                )}
                title={`${turn.name} · ${turn.role}`}
              >
                <span>{turn.avatar}</span>
              </div>

              {/* Speech Block */}
              <div className="flex-1 min-w-0 max-w-[88%] sm:max-w-[82%]">
                <div className="flex items-center gap-1.5 mb-1 leading-none">
                  <span className="text-xs font-semibold text-stone-900">{turn.name}</span>
                  <span className={twMerge(
                    "h-4 px-1.5 rounded-full text-[10px] font-medium leading-none inline-flex items-center border",
                    turn.badgeBg,
                    turn.badgeText,
                    turn.badgeBorder
                  )}>
                    {turn.role}
                  </span>
                </div>

                <div className={twMerge(
                  "px-4 py-2.5 rounded-2xl rounded-tl-xs bg-white text-stone-800 text-sm leading-6 shadow-2xs border transition-all",
                  turn.bubbleBorder || "border-stone-200/80"
                )}>
                  <div className="prose prose-sm prose-stone max-w-none prose-p:my-0.5 prose-p:leading-6 prose-strong:text-stone-900 prose-strong:font-semibold">
                    <Markdown>{turn.content}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  // Standard 1-on-1 or User Message
  return (
    <div className={twMerge("flex w-full mb-3.5", isUser ? "justify-end" : "justify-start")}>
      <div className={twMerge("flex max-w-[88%] sm:max-w-[82%] gap-2 sm:gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* User / Bot Avatar */}
        <div className={twMerge(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-2xs text-xs font-medium",
          isUser 
            ? "bg-indigo-600 text-white" 
            : "bg-indigo-50 text-indigo-700 border border-indigo-200"
        )}>
          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>
        
        <div className="flex-1 min-w-0">
          {!isUser && (
            <div className="flex items-center gap-1.5 mb-1 leading-none">
              <span className="text-xs font-semibold text-stone-900">共读引导员</span>
              <span className="h-4 px-1.5 rounded-full text-[10px] font-medium leading-none inline-flex items-center bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                AI 伙伴
              </span>
            </div>
          )}

          <div className={twMerge(
            "px-4 py-2.5 rounded-2xl shadow-2xs text-sm leading-6",
            isUser 
              ? "bg-indigo-600 text-white rounded-tr-xs" 
              : "bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs"
          )}>
            {isUser ? (
              <div className="whitespace-pre-wrap font-normal">{message.text}</div>
            ) : (
              <div className="prose prose-sm prose-stone max-w-none prose-p:my-1 prose-p:leading-6 prose-strong:text-stone-900 prose-strong:font-semibold prose-ul:my-1 prose-li:my-0.5">
                <Markdown>{message.text}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
