import React, { useState } from 'react';
import { X, Key, ExternalLink, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { translations } from '../i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  lang: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, onSaveApiKey, lang }) => {
  const [tempKey, setTempKey] = useState(apiKey);
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
          className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-stone-200/80"
        >
          {/* iOS Grab Handle */}
          <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-800">{t.settingsTitle}</h2>
                <p className="text-[11px] text-stone-500">{t.settingsSubtitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            <div className="bg-stone-50/80 rounded-2xl border border-stone-200/70 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-stone-800">{t.customApiKey}</h3>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                {t.apiKeyDesc}
              </p>
              <div className="space-y-3 pt-1">
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white border border-stone-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 transition-all font-mono"
                />
                <button
                  onClick={() => {
                    onSaveApiKey(tempKey);
                    onClose();
                  }}
                  className="w-full bg-stone-900 text-white py-2.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-stone-800 active:scale-[0.98] transition-all shadow-xs"
                >
                  {t.saveApiKey}
                </button>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 pt-1 hover:underline"
                >
                  {t.getApiKey} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 sm:py-4 bg-white border-t border-stone-100 pb-7 sm:pb-4 text-center shrink-0">
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
