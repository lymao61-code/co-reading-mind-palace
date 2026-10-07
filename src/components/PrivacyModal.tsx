import React from 'react';
import { ShieldCheck, Database, Lock, EyeOff, X, Info, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { translations } from '../i18n';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, lang }) => {
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
          className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-stone-200/80"
        >
          {/* iOS Grab Handle */}
          <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-stone-100 bg-indigo-50/20 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-800">{t.privacyTitle}</h2>
                <p className="text-[11px] text-stone-500">{t.privacySubtitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1">
            <div className="bg-stone-50/80 rounded-2xl border border-stone-200/70 divide-y divide-stone-200/60 overflow-hidden">
              <div className="p-3.5 flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-800">{t.localStoreTitle}</h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                    {t.localStoreDesc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mt-0.5">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-800">{t.absolutePrivacyTitle}</h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                    {t.absolutePrivacyDesc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-800">{t.apiKeySecurityTitle}</h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                    {t.apiKeySecurityDesc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-800">{t.zeroAccountTitle}</h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                    {t.zeroAccountDesc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-800">{t.anonStatsTitle}</h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                    {t.anonStatsDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white border-t border-stone-100 pb-7 sm:pb-5 text-center shrink-0">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 bg-stone-900 text-white rounded-2xl text-xs sm:text-sm font-medium hover:bg-stone-800 active:scale-[0.98] transition-all shadow-sm"
            >
              {t.gotIt}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
