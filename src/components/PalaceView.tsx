import React, { useState } from 'react';
import { MindPalaceNote, SharedPalace, Language } from '../types';
import { 
  BookOpen, 
  Bookmark, 
  Calendar, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Share2, 
  Compass, 
  ArrowLeft, 
  Download,
  CheckSquare,
  Square
} from 'lucide-react';
import { format } from 'date-fns';
import { translations } from '../i18n';

interface PalaceViewProps {
  notes: MindPalaceNote[];
  onSelectNote: (note: MindPalaceNote) => void;
  lang: Language;
  onOpenExchange: (initialNoteIds?: string[]) => void;
  friendPalace: SharedPalace | null;
  onClearFriendPalace: () => void;
  onImportFriendNotes: (notes: MindPalaceNote[]) => void;
}

export const PalaceView: React.FC<PalaceViewProps> = ({
  notes,
  onSelectNote,
  lang,
  onOpenExchange,
  friendPalace,
  onClearFriendPalace,
  onImportFriendNotes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPalaceTab, setSelectedPalaceTab] = useState<'my' | 'friend'>('my');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const t = translations[lang];

  // If friend palace was loaded, automatically select 'friend' tab
  const currentViewingPalace = selectedPalaceTab === 'friend' && friendPalace ? friendPalace.notes : notes;

  const filteredNotes = currentViewingPalace.filter(n => 
    n.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectNote = (id: string) => {
    setSelectedNoteIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedNoteIds(notes.map(n => n.id));
  };

  const handleClearSelection = () => {
    setSelectedNoteIds([]);
  };

  const handleShareSelected = () => {
    if (selectedNoteIds.length === 0) return;
    onOpenExchange(selectedNoteIds);
    setIsSelectMode(false);
    setSelectedNoteIds([]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-100 overflow-hidden relative">
      {/* Top Palace Header */}
      <div className="p-3.5 bg-white border-b border-stone-200/80 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-semibold text-stone-800 text-base">{t.appName}</h2>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {selectedPalaceTab === 'my' && notes.length > 0 && (
              <button
                onClick={() => {
                  if (isSelectMode) {
                    setIsSelectMode(false);
                    setSelectedNoteIds([]);
                  } else {
                    setIsSelectMode(true);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 border ${
                  isSelectMode
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                }`}
              >
                {isSelectMode ? t.cancelSelect : t.batchSelect}
              </button>
            )}

            <button
              onClick={() => onOpenExchange()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200/80 transition-all active:scale-95 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.exchangePalace}</span>
            </button>
          </div>
        </div>

        {/* Selection mode control toolbar */}
        {isSelectMode && selectedPalaceTab === 'my' && (
          <div className="mb-2.5 p-2 bg-indigo-50/70 border border-indigo-200/70 rounded-xl flex items-center justify-between gap-2 text-xs">
            <span className="text-indigo-900 font-medium pl-1 text-[11px] sm:text-xs">
              {t.selectedNotesCount
                .replace('{count}', selectedNoteIds.length.toString())
                .replace('{total}', notes.length.toString())}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 rounded-lg text-[11px] font-medium"
              >
                {t.selectAll}
              </button>
              <button
                onClick={handleClearSelection}
                className="px-2 py-1 bg-white hover:bg-stone-50 text-stone-500 border border-stone-200/80 rounded-lg text-[11px]"
              >
                {t.deselectAll}
              </button>
            </div>
          </div>
        )}

        {/* Palace Segment Switcher: My Palace vs Friend's Palace */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 grid grid-cols-2 p-0.5 bg-stone-100 rounded-xl text-xs font-medium border border-stone-200/60">
            <button
              onClick={() => setSelectedPalaceTab('my')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                selectedPalaceTab === 'my'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{t.myPalaceTab}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-stone-200/80 rounded-full">
                {notes.length}
              </span>
            </button>
            <button
              onClick={() => {
                if (!friendPalace) {
                  onOpenExchange();
                } else {
                  setSelectedPalaceTab('friend');
                }
              }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                selectedPalaceTab === 'friend' && friendPalace
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{t.friendPalaceTab}</span>
              {friendPalace && (
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full">
                  {friendPalace.notes.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'zh' ? "搜索书名、章节或感悟..." : "Search books, chapters or notes..."}
            className="w-full bg-stone-100 text-xs rounded-xl pl-8 pr-3 py-2 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Touring Friend's Palace Sticky Action Banner */}
      {selectedPalaceTab === 'friend' && friendPalace && (
        <div className="px-3.5 py-2.5 bg-amber-50 border-b border-amber-200/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-4 h-4 text-amber-600 shrink-0 animate-spin-slow" />
            <div className="truncate text-xs">
              <span className="font-medium text-stone-800">
                {t.viewingFriendPalace.replace('{author}', friendPalace.author)}
              </span>
              <span className="text-[11px] text-stone-500 ml-1.5">
                《{friendPalace.title}》
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onImportFriendNotes(friendPalace.notes)}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-medium transition-colors shadow-2xs"
            >
              <Download className="w-3 h-3" />
              <span>{t.importToMyPalace}</span>
            </button>
            <button
              onClick={() => {
                onClearFriendPalace();
                setSelectedPalaceTab('my');
              }}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md text-[11px]"
              title={t.backToMyPalace}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Notes Cards List */}
      <div className={`flex-1 overflow-y-auto p-3.5 space-y-3 ${isSelectMode ? 'pb-24' : ''}`}>
        {selectedPalaceTab === 'friend' && !friendPalace ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-stone-700 mb-1">{t.noFriendPalace}</h3>
            <p className="text-xs text-stone-500 max-w-[240px] leading-relaxed mb-4">
              {t.noFriendPalaceDesc}
            </p>
            <button
              onClick={() => onOpenExchange()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
            >
              {t.visitPalaceBtn}
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-200/80 text-stone-400 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-stone-700 mb-1">{t.noNotes}</h3>
            <p className="text-xs text-stone-500 max-w-[240px] leading-relaxed">
              {t.noNotesSub}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isSelected = selectedNoteIds.includes(note.id);
            return (
              <div
                key={note.id}
                onClick={() => {
                  if (isSelectMode && selectedPalaceTab === 'my') {
                    toggleSelectNote(note.id);
                  } else {
                    onSelectNote(note);
                  }
                }}
                className={`bg-white p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelectMode && isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                    : 'border-stone-200/90 shadow-2xs hover:border-indigo-200 active:scale-[0.99]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {isSelectMode && selectedPalaceTab === 'my' && (
                      <div className="shrink-0 text-indigo-600">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                    )}
                    <h3 className="font-serif font-semibold text-stone-800 text-sm leading-snug line-clamp-1">
                      {note.bookTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {selectedPalaceTab === 'my' && !isSelectMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenExchange([note.id]);
                        }}
                        className="p-1 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title={t.shareThisNote}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                  <span className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md font-medium text-stone-600">
                    <Bookmark className="w-3 h-3 text-indigo-500" />
                    {note.chapter}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    {format(new Date(note.date), 'MM/dd')}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2">
                  {note.summary}
                </p>

                {note.takeaways && note.takeaways.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100">
                    <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                      {note.takeaways.length} {lang === 'zh' ? '条核心启示' : 'takeaways'}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Action Bar in Batch Selection Mode */}
      {isSelectMode && selectedPalaceTab === 'my' && (
        <div className="absolute bottom-3 left-3 right-3 p-3 bg-stone-900/95 backdrop-blur-md text-white rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 z-20">
          <div className="text-xs font-medium">
            <span className="text-stone-300">
              {t.selectedNotesCount
                .replace('{count}', selectedNoteIds.length.toString())
                .replace('{total}', notes.length.toString())}
            </span>
          </div>

          <button
            onClick={handleShareSelected}
            disabled={selectedNoteIds.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-40 text-white rounded-xl text-xs font-medium shadow-md transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.shareSelectedCount.replace('{count}', selectedNoteIds.length.toString())}</span>
          </button>
        </div>
      )}
    </div>
  );
};
