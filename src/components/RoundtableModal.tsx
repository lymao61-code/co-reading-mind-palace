import React, { useState } from 'react';
import { CelebrityGuest, Language } from '../types';
import { PRESET_CELEBRITY_GUESTS } from '../services/roundtableService';
import { translations } from '../i18n';
import { Users, X, Plus, Sparkles, Check, Trash2, ArrowRight } from 'lucide-react';

interface RoundtableModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuests: CelebrityGuest[];
  onInviteGuest: (guest: CelebrityGuest) => void;
  onRemoveGuest: (guestId: string) => void;
  lang: Language;
}

export const RoundtableModal: React.FC<RoundtableModalProps> = ({
  isOpen,
  onClose,
  currentGuests,
  onInviteGuest,
  onRemoveGuest,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customName, setCustomName] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const t = translations[lang];

  if (!isOpen) return null;

  const currentGuestIds = new Set(currentGuests.map(g => g.id));

  const handleInviteCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customName.trim();
    if (!name) return;

    const newGuest: CelebrityGuest = {
      id: `custom_${Date.now()}`,
      name: name,
      nameEn: name,
      avatar: '✨',
      title: '特邀思想家 · 深度思辨',
      titleEn: 'Special Guest Thinker',
      description: customPrompt.trim() || `以${name}的独特智慧视角探讨书本。`,
      descriptionEn: customPrompt.trim() || `Exploring ideas through the perspective of ${name}.`,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      promptFocus: customPrompt.trim() 
        ? `以【${name}】本人的经典思想、独到理论体系与语调发言。核心切入视角：${customPrompt.trim()}。紧扣读者所读书籍和当前对话进行探讨。`
        : `以【${name}】本人的经典思想、历史言论风格、思维范式与人格特征发言。紧扣读者所读书籍，给出深刻启示。`
    };

    onInviteGuest(newGuest);
    setCustomName('');
    setCustomPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-xl max-h-[88vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between shrink-0 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2 leading-tight">
                {t.roundtableTitle}
                <span className="h-5 px-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-medium leading-none inline-flex items-center">
                  {currentGuests.length > 0 ? `${currentGuests.length} 位在座` : '1对1转圆桌'}
                </span>
              </h2>
              <p className="text-xs text-stone-500 leading-normal line-clamp-1 mt-0.5">{t.roundtableSubtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Current Table Seating Bar */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-xs font-medium text-stone-500 mb-2 flex items-center justify-between leading-none">
              <span>{t.currentTableGuests}</span>
              <span className="text-stone-400">
                {currentGuests.length + 2} 位席位
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 items-center">
              {/* Host */}
              <div className="h-6 px-2.5 rounded-full bg-white border border-indigo-200/80 text-indigo-900 text-xs font-medium leading-none inline-flex items-center gap-1.5 shadow-2xs">
                <span>🎙️</span>
                <span>{t.tableHostName}</span>
                <span className="text-indigo-400">· 主持</span>
              </div>

              {/* Reader */}
              <div className="h-6 px-2.5 rounded-full bg-white border border-stone-200 text-stone-800 text-xs font-medium leading-none inline-flex items-center gap-1.5 shadow-2xs">
                <span>👤</span>
                <span>{t.tableReaderName}</span>
                <span className="text-stone-400">· 主宾</span>
              </div>

              {/* Seated Guests */}
              {currentGuests.map((guest) => (
                <div 
                  key={guest.id}
                  className="h-6 pl-2.5 pr-1.5 rounded-full bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 text-indigo-950 text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>{guest.avatar}</span>
                  <span>{lang === 'zh' ? guest.name : guest.nameEn}</span>
                  <button
                    onClick={() => onRemoveGuest(guest.id)}
                    className="p-0.5 text-stone-400 hover:text-rose-600 rounded-full transition-colors ml-0.5"
                    title={t.leaveTable}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 h-8 text-xs font-medium rounded-lg leading-none inline-flex items-center justify-center transition-all ${
                activeTab === 'presets'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.presetGuestsTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 h-8 text-xs font-medium rounded-lg leading-none inline-flex items-center justify-center transition-all ${
                activeTab === 'custom'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.customGuestTab}
            </button>
          </div>

          {/* Tab 1: Preset Celebrities Grid */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_CELEBRITY_GUESTS.map((preset) => {
                const isSeated = currentGuestIds.has(preset.id);
                return (
                  <div
                    key={preset.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isSeated 
                        ? 'bg-indigo-50/40 border-indigo-200' 
                        : 'bg-white hover:bg-stone-50/60 border-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0">{preset.avatar}</span>
                          <div>
                            <div className="font-semibold text-stone-900 text-xs sm:text-sm leading-tight">
                              {lang === 'zh' ? preset.name : preset.nameEn}
                            </div>
                            <div className="text-xs text-stone-500 leading-tight mt-0.5 line-clamp-1">
                              {lang === 'zh' ? preset.title : preset.titleEn}
                            </div>
                          </div>
                        </div>

                        {preset.isAuthor && (
                          <span className="h-5 px-1.5 rounded bg-indigo-50 text-indigo-700 text-xs border border-indigo-200 font-medium shrink-0 leading-none inline-flex items-center">
                            原著
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-5">
                        {lang === 'zh' ? preset.description : preset.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-end">
                      {isSeated ? (
                        <div className="flex items-center gap-2">
                          <span className="h-7 px-2.5 inline-flex items-center gap-1 text-xs font-medium text-indigo-700 leading-none">
                            <Check className="w-3 h-3 text-indigo-600" />
                            <span>{t.guestSeated}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveGuest(preset.id)}
                            className="h-7 px-2 text-xs text-stone-400 hover:text-stone-800 transition-colors leading-none"
                          >
                            {t.leaveTable}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onInviteGuest(preset);
                            onClose();
                          }}
                          className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium leading-none inline-flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.inviteToTable}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Custom Guest */}
          {activeTab === 'custom' && (
            <form onSubmit={handleInviteCustom} className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 text-stone-800 font-medium text-xs leading-tight">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>自由邀请任意历史先贤、学者或当代人物入座</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 leading-none">
                  人物姓名 / 称谓
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={t.customGuestNamePlaceholder}
                  className="h-9 w-full px-3 bg-white border border-stone-200 rounded-lg text-xs leading-5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 leading-none">
                  期望探讨的思想视角或风格（可选）
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t.customGuestPromptPlaceholder}
                  rows={3}
                  className="w-full p-3 bg-white border border-stone-200 rounded-lg text-xs leading-5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={!customName.trim()}
                  className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-medium leading-none inline-flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.inviteCustomGuestBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-stone-400 leading-none">
            <span>💡 提示：在聊天中直接输入“邀请苏格拉底/王阳明/特德姜/作者”亦可自动入座</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 px-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-medium leading-none transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
