import React, { useState, useEffect } from 'react';
import { X, Users, MapPin, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { translations } from '../i18n';

interface Stats {
  totalVisits: number;
  uniqueIps: number;
  cities: { city: string; count: number }[];
  avgDuration: number;
  recentSessions: any[];
}

export const StatsModal: React.FC<{ isOpen: boolean; onClose: () => void; lang: Language }> = ({ isOpen, onClose, lang }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/analytics/stats')
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch stats', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

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
          className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-stone-200/80"
        >
          {/* iOS Grab Handle */}
          <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-800">{t.statsTitle}</h2>
                <p className="text-[11px] text-stone-500">{t.statsSubtitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-stone-800"></div>
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-stone-50/90 p-3 sm:p-4 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-stone-400 mb-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">{t.totalVisits}</span>
                    </div>
                    <div className="text-lg sm:text-2xl font-serif font-bold text-stone-800">{stats.totalVisits}</div>
                  </div>

                  <div className="bg-stone-50/90 p-3 sm:p-4 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-stone-400 mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">{t.uniqueVisitors}</span>
                    </div>
                    <div className="text-lg sm:text-2xl font-serif font-bold text-stone-800">{stats.uniqueIps}</div>
                  </div>

                  <div className="bg-stone-50/90 p-3 sm:p-4 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-stone-400 mb-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">{t.avgDuration}</span>
                    </div>
                    <div className="text-lg sm:text-2xl font-serif font-bold text-stone-800">
                      {Math.round(stats.avgDuration / 60)}{t.minutes}
                    </div>
                  </div>
                </div>

                <section>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" /> {t.topCities}
                  </h3>
                  <div className="bg-stone-50/80 rounded-2xl border border-stone-200/70 divide-y divide-stone-200/60 overflow-hidden">
                    {stats.cities && stats.cities.length > 0 ? (
                      stats.cities.map((city, i) => (
                        <div key={i} className="flex items-center justify-between px-3.5 py-2.5">
                          <span className="text-xs sm:text-sm text-stone-700 font-medium">{city.city}</span>
                          <span className="text-[11px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-semibold">{city.count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-stone-400 text-center">No location records yet</div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-stone-500" /> {t.recentActivity}
                  </h3>
                  <div className="bg-stone-50/80 rounded-2xl border border-stone-200/70 divide-y divide-stone-200/60 overflow-hidden">
                    {stats.recentSessions && stats.recentSessions.length > 0 ? (
                      stats.recentSessions.slice(0, 8).map((session: any, i: number) => (
                        <div key={i} className="text-xs flex items-center justify-between px-3.5 py-2.5">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-stone-800 font-medium truncate">{session.city || 'Unknown'}, {session.country || 'Global'}</span>
                            <span className="text-[10px] text-stone-400">{new Date(session.last_heartbeat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="text-stone-500 font-mono text-[11px] shrink-0">
                            {Math.round(session.duration_seconds / 60)}{t.minutes} {session.duration_seconds % 60}{t.seconds}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-stone-400 text-center">No recent sessions</div>
                    )}
                  </div>
                </section>
              </>
            ) : (
              <div className="text-center text-xs text-stone-500 py-8">Failed to load statistics.</div>
            )}
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
