import React, { useState, useEffect } from 'react';
import { X, Share2, Download, Upload, Copy, Check, Sparkles, Compass, ShieldCheck, CheckSquare, Square, Bookmark, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MindPalaceNote, SharedPalace, Language } from '../types';
import { translations } from '../i18n';

interface PalaceExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: MindPalaceNote[];
  onLoadFriendPalace: (palace: SharedPalace) => void;
  onImportNotes: (notes: MindPalaceNote[]) => void;
  lang: Language;
  initialSelectedNoteIds?: string[];
}

export const PalaceExchangeModal: React.FC<PalaceExchangeModalProps> = ({
  isOpen,
  onClose,
  notes,
  onLoadFriendPalace,
  onImportNotes,
  lang,
  initialSelectedNoteIds
}) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'share' | 'visit'>('share');
  
  // Selected notes state (default to initialSelectedNoteIds if provided, else all notes)
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);

  // Share form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(() => localStorage.getItem('palace_author_name') || (lang === 'zh' ? '共读书友' : 'Reader'));
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState<{ code: string; title: string; author: string } | null>(null);
  const [copiedType, setCopiedType] = useState<'code' | 'link' | null>(null);

  // Visit form state
  const [inputCode, setInputCode] = useState('');
  const [isLoadingPalace, setIsLoadingPalace] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setShareResult(null);
      setErrorMessage('');
      if (initialSelectedNoteIds && initialSelectedNoteIds.length > 0) {
        setSelectedNoteIds(initialSelectedNoteIds);
        const firstNote = notes.find(n => n.id === initialSelectedNoteIds[0]);
        if (initialSelectedNoteIds.length === 1 && firstNote) {
          setTitle(lang === 'zh' ? `《${firstNote.bookTitle}》· 读书笔记` : `Notes: ${firstNote.bookTitle}`);
        } else {
          setTitle(lang === 'zh' ? `我的精选读书感悟 (${initialSelectedNoteIds.length}篇)` : `My Curated Reading Notes (${initialSelectedNoteIds.length})`);
        }
      } else {
        setSelectedNoteIds(notes.map(n => n.id));
        setTitle(lang === 'zh' ? '我的精选读书宫殿' : 'My Curated Mind Palace');
      }
    }
  }, [isOpen, initialSelectedNoteIds, notes, lang]);

  if (!isOpen) return null;

  // Toggle single note selection
  const handleToggleNote = (id: string) => {
    setSelectedNoteIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      // Adapt title if changed to single note
      if (next.length === 1) {
        const single = notes.find(n => n.id === next[0]);
        if (single) {
          setTitle(lang === 'zh' ? `《${single.bookTitle}》· 读书笔记` : `Notes: ${single.bookTitle}`);
        }
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedNoteIds(notes.map(n => n.id));
  };

  const handleDeselectAll = () => {
    setSelectedNoteIds([]);
  };

  const selectedNotes = notes.filter(n => selectedNoteIds.includes(n.id));

  // Handle Share to Cloud
  const handleGenerateShare = async () => {
    if (notes.length === 0) {
      alert(t.emptyPalaceShareError);
      return;
    }

    if (selectedNotes.length === 0) {
      alert(t.selectAtLeastOne);
      return;
    }

    setIsSharing(true);
    setErrorMessage('');
    try {
      localStorage.setItem('palace_author_name', author);
      const res = await fetch('/api/palace/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || (selectedNotes.length === 1 ? `《${selectedNotes[0].bookTitle}》` : (lang === 'zh' ? '读书笔记精选' : 'Curated Notes')),
          author,
          notes: selectedNotes
        })
      });

      if (!res.ok) throw new Error('Share request failed');
      const data = await res.json();
      setShareResult({
        code: data.code,
        title: data.title,
        author: data.author
      });
    } catch (e) {
      console.error(e);
      setErrorMessage(lang === 'zh' ? '生成分享码失败，请重试' : 'Failed to generate share code');
    } finally {
      setIsSharing(false);
    }
  };

  // Handle Copying Code or Link
  const handleCopy = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Handle Fetching Friend's Palace
  const handleVisitFriend = async () => {
    let cleanCode = inputCode.trim();
    if (!cleanCode) return;

    // If user pasted a URL, extract ?palace=CODE or #palace=CODE
    if (cleanCode.includes('palace=')) {
      const match = cleanCode.match(/palace=([a-zA-Z0-9_-]+)/);
      if (match) cleanCode = match[1];
    }

    setIsLoadingPalace(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/palace/${encodeURIComponent(cleanCode)}`);
      if (!res.ok) {
        throw new Error('Palace not found');
      }
      const palaceData: SharedPalace = await res.json();
      onLoadFriendPalace(palaceData);
      onClose();
    } catch {
      setErrorMessage(t.palaceNotFound);
    } finally {
      setIsLoadingPalace(false);
    }
  };

  // Handle Exporting JSON file for selected notes
  const handleExportJson = () => {
    const notesToExport = selectedNotes.length > 0 ? selectedNotes : notes;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notesToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mind_palace_selected_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Importing JSON file
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportNotes(parsed);
          alert(t.importSuccess.replace('{count}', parsed.length.toString()));
          onClose();
        } else {
          alert(lang === 'zh' ? '无效的文件格式' : 'Invalid file format');
        }
      } catch {
        alert(lang === 'zh' ? '文件读取失败' : 'Failed to parse JSON');
      }
    };
    reader.readAsText(file);
  };

  const directShareUrl = shareResult ? `${window.location.origin}${window.location.pathname}?palace=${shareResult.code}` : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-stone-200/80"
        >
          {/* iOS Grab Bar */}
          <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
          </div>

          {/* Modal Header */}
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-stone-100 bg-stone-50/70 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-800">{t.palaceExchangeTitle}</h2>
                <p className="text-[11px] text-stone-500">{t.palaceExchangeSubtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Switcher */}
          <div className="p-3 bg-stone-50 border-b border-stone-100 shrink-0">
            <div className="grid grid-cols-2 p-1 bg-stone-200/70 rounded-xl gap-1 text-xs font-medium">
              <button
                onClick={() => setActiveSubTab('share')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeSubTab === 'share' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.shareMyPalace}</span>
              </button>
              <button
                onClick={() => setActiveSubTab('visit')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeSubTab === 'visit' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{t.visitFriendPalace}</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Zero-Account Data Separation Guarantee Banner */}
            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px] sm:text-xs">
                {t.dataSeparationNotice}
              </div>
            </div>

            {activeSubTab === 'share' ? (
              <div className="space-y-4">
                {/* Note Selection Section */}
                <div className="bg-stone-50 p-3 sm:p-3.5 rounded-2xl border border-stone-200/80 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-stone-800">{t.selectNotesToShare}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {t.selectedNotesCount
                          .replace('{count}', selectedNoteIds.length.toString())
                          .replace('{total}', notes.length.toString())}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-xs">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 rounded-lg text-[11px] font-medium transition-colors"
                      >
                        {t.selectAll}
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-500 border border-stone-200/80 rounded-lg text-[11px] transition-colors"
                      >
                        {t.deselectAll}
                      </button>
                    </div>
                  </div>

                  {/* Scrollable list of selectable notes */}
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-0.5 divide-y divide-stone-200/40">
                    {notes.map(note => {
                      const isSelected = selectedNoteIds.includes(note.id);
                      return (
                        <div
                          key={note.id}
                          onClick={() => handleToggleNote(note.id)}
                          className={`pt-2 first:pt-0 p-2 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 border ${
                            isSelected
                              ? 'bg-indigo-50/50 border-indigo-200/90 text-stone-900'
                              : 'bg-white/70 border-stone-200/60 hover:bg-stone-100/70 text-stone-600 opacity-75'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 text-indigo-600">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                            ) : (
                              <Square className="w-4 h-4 text-stone-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="font-serif font-semibold text-xs text-stone-800 truncate">
                                《{note.bookTitle}》
                              </span>
                              <span className="shrink-0 text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-medium">
                                {note.chapter}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 line-clamp-1 leading-snug">
                              {note.summary}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedNoteIds.length === 0 && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/70 rounded-xl px-2.5 py-1.5">
                      ⚠️ {t.selectAtLeastOne}
                    </p>
                  )}
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">{t.palaceTitleInput}</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={selectedNoteIds.length === 1 ? "e.g. 思考快与慢读书笔记" : "e.g. 小李的精选书架"}
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">{t.palaceAuthorInput}</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. 小李 / Alex"
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Share Button */}
                {!shareResult ? (
                  <button
                    onClick={handleGenerateShare}
                    disabled={isSharing || selectedNoteIds.length === 0}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-medium shadow-md hover:shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>
                      {isSharing
                        ? t.generatingCode
                        : t.shareSelectedCount.replace('{count}', selectedNoteIds.length.toString())}
                    </span>
                  </button>
                ) : (
                  /* Generated Palace Code Result */
                  <div className="p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3 shadow-md animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400 font-medium">{t.shareCodeReady}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                        ONLINE
                      </span>
                    </div>

                    {/* Big Code Pill */}
                    <div className="flex items-center justify-between bg-stone-800/90 rounded-xl px-3.5 py-2.5 border border-stone-700/80">
                      <span className="font-mono text-lg font-bold tracking-wider text-amber-300">
                        {shareResult.code}
                      </span>
                      <button
                        onClick={() => handleCopy(shareResult.code, 'code')}
                        className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 rounded-lg text-xs text-stone-200 flex items-center gap-1 transition-colors"
                      >
                        {copiedType === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === 'code' ? t.copied : t.copyShareCode}</span>
                      </button>
                    </div>

                    {/* Direct Link */}
                    <div className="flex items-center justify-between bg-stone-800/90 rounded-xl px-3.5 py-2 border border-stone-700/80 text-xs">
                      <span className="text-stone-300 truncate max-w-[200px] text-[11px]">{directShareUrl}</span>
                      <button
                        onClick={() => handleCopy(directShareUrl, 'link')}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                      >
                        {copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === 'link' ? t.copied : t.copyShareLink}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-400 leading-relaxed text-center">
                      {lang === 'zh'
                        ? '朋友直接打开此链接，即可在免登录的环境下漫步您的宫殿或一键收藏！'
                        : 'Friends can open this link directly to tour your palace without signing in!'}
                    </p>
                  </div>
                )}

                {/* Offline File Backup Export */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{lang === 'zh' ? '也支持离线文件传输' : 'Or export offline file'}</span>
                  <button
                    onClick={handleExportJson}
                    disabled={selectedNoteIds.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors font-medium text-xs disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.exportJson} ({selectedNoteIds.length})</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Visit Friend's Palace Tab */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-stone-700">{t.enterFriendCode}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="e.g. PAL-7K9A"
                      className="flex-1 uppercase font-mono text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                    />
                    <button
                      onClick={handleVisitFriend}
                      disabled={isLoadingPalace || !inputCode.trim()}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{isLoadingPalace ? t.fetchingPalace : t.visitPalaceBtn}</span>
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Or Import Backup File */}
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <div className="text-xs font-medium text-stone-700">{lang === 'zh' ? '或者导入好友发送的 .json 文件' : 'Or import .json backup file'}</div>
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-stone-200 hover:border-indigo-400 rounded-2xl cursor-pointer bg-stone-50/50 hover:bg-indigo-50/30 transition-all text-xs text-stone-600 font-medium">
                    <Upload className="w-4 h-4 text-indigo-500" />
                    <span>{t.importJson}</span>
                    <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 sm:py-4 bg-white border-t border-stone-100 pb-safe text-center shrink-0">
            <button
              onClick={onClose}
              className="text-xs font-medium text-stone-500 hover:text-stone-700 py-1"
            >
              {t.sheetClose}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
