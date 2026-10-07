import React, { useState } from 'react';
import { Key, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { translations } from '../i18n';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  lang: Language;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, lang }) => {
  const [key, setKey] = useState('');
  const t = translations[lang];

  if (!isOpen) return null;

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
          className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[88vh] sm:max-h-[85vh] overflow-hidden border border-stone-200/80 flex flex-col"
        >
          {/* iOS Grab Handle */}
          <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Key className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-800">{t.customApiKey}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto">
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.quotaError}
            </p>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800 text-xs sm:text-sm font-mono"
            />
            <p className="text-[11px] text-stone-400">
              {t.apiKeySecurityDesc}
            </p>
            <button
              onClick={() => {
                if (key.trim()) {
                  onSave(key.trim());
                  setKey('');
                }
              }}
              className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-stone-800 active:scale-[0.98] transition-all shadow-xs"
            >
              {t.saveApiKey}
            </button>
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
