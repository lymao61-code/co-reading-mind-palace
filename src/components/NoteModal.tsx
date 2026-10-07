import React, { useState, useEffect } from 'react';
import { MindPalaceNote, Language } from '../types';
import { X, BookOpen, Bookmark, Calendar, Languages, Loader2, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { translations } from '../i18n';
import { translateNote } from '../services/geminiService';

interface NoteModalProps {
  note: MindPalaceNote | null;
  onClose: () => void;
  lang: Language;
  customApiKey?: string;
  onShareNote?: (note: MindPalaceNote) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, lang, customApiKey, onShareNote }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState<{ summary: string; takeaways: string[] } | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setTranslatedData(null);
    setShowTranslation(false);
  }, [note]);

  if (!note) return null;

  const handleTranslate = async () => {
    if (translatedData) {
      setShowTranslation(!showTranslation);
      return;
    }

    setIsTranslating(true);
    try {
      const data = await translateNote(note, lang === 'zh' ? 'en' : 'zh', customApiKey);
      setTranslatedData(data);
      setShowTranslation(true);
    } catch (error) {
      console.error("Translation failed", error);
      alert("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const displaySummary = showTranslation && translatedData ? translatedData.summary : note.summary;
  const displayTakeaways = showTranslation && translatedData ? translatedData.takeaways : note.takeaways;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-stone-200/80"
        >
          {/* iOS Grab Handle */}
          <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-800 truncate">{note.bookTitle}</h2>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-stone-500 mt-0.5">
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <Bookmark className="w-3 h-3 shrink-0" />
                    {note.chapter}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {format(new Date(note.date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onShareNote && (
                <button
                  onClick={() => {
                    onShareNote(note);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all"
                  title={t.shareThisNote}
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden xs:inline">{t.shareThisNote}</span>
                </button>
              )}
              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100/80 transition-all disabled:opacity-50"
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Languages className="w-3.5 h-3.5" />
                )}
                <span className="hidden xs:inline">{showTranslation ? t.original : t.translate}</span>
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <section className="bg-stone-50/60 p-4 rounded-2xl border border-stone-200/60">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{t.summary}</h3>
              <div className="prose prose-stone prose-sm max-w-none text-stone-700 leading-relaxed text-xs sm:text-sm">
                <Markdown>{displaySummary}</Markdown>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">{t.takeaways}</h3>
              <ul className="space-y-2.5">
                {displayTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2.5 bg-stone-50/80 p-3 sm:p-3.5 rounded-2xl border border-stone-200/60">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-stone-700 leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="px-5 py-3 bg-white border-t border-stone-100 pb-7 sm:pb-3 text-center shrink-0">
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
