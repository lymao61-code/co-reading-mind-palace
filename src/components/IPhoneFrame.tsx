import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface IPhoneFrameProps {
  children: React.ReactNode;
  isIPhoneMode: boolean;
  isRealMobile: boolean;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ 
  children, 
  isIPhoneMode,
  isRealMobile
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // If on a real mobile phone (or mobile viewport), render as an authentic edge-to-edge native iOS web app
  if (isRealMobile) {
    return (
      <div className="fixed inset-0 w-full h-full h-[100dvh] bg-stone-100 flex flex-col overflow-hidden z-10">
        <div className="flex-1 flex flex-col w-full h-full overflow-hidden relative">
          {children}
        </div>
      </div>
    );
  }

  // If on desktop and user switched to desktop mode
  if (!isIPhoneMode) {
    return <div className="w-full h-screen flex overflow-hidden">{children}</div>;
  }

  // If on desktop in iPhone preview mode: render high-fidelity iPhone 16 Pro mockup frame
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-950 via-stone-900 to-neutral-950 flex items-center justify-center p-4 md:p-6 overflow-hidden select-none">
      {/* Outer Phone Shell with subtle titanium luster */}
      <div className="relative w-[393px] h-[852px] max-h-[96vh] aspect-[393/852] bg-stone-950 p-[10px] rounded-[54px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.14)_inset] flex flex-col transition-all duration-300">
        {/* Hardware side buttons */}
        <div className="block absolute -left-[13px] top-[115px] w-[3px] h-[26px] bg-stone-700 rounded-l-sm" title="Action Button" />
        <div className="block absolute -left-[13px] top-[160px] w-[3px] h-[48px] bg-stone-700 rounded-l-sm" title="Volume Up" />
        <div className="block absolute -left-[13px] top-[220px] w-[3px] h-[48px] bg-stone-700 rounded-l-sm" title="Volume Down" />
        <div className="block absolute -right-[13px] top-[175px] w-[3px] h-[70px] bg-stone-700 rounded-r-sm" title="Power Button" />

        {/* Inner Screen Glass */}
        <div className="relative w-full h-full bg-stone-100 rounded-[44px] overflow-hidden flex flex-col shadow-inner">
          {/* iOS Top Status Bar */}
          <div className="h-11 bg-white/85 backdrop-blur-md px-6 pt-2 flex items-center justify-between text-stone-900 text-xs font-semibold z-40 shrink-0 border-b border-stone-100/60">
            <span className="w-12 tracking-tight text-[13px] font-medium">{time || '09:41'}</span>
            
            {/* Dynamic Island */}
            <div className="h-[28px] w-[112px] bg-black rounded-full flex items-center justify-between px-3 text-white shadow-sm -mt-1 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800/80 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-indigo-500/80" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono text-stone-300">PALACE</span>
              </div>
            </div>

            {/* iOS Status Icons */}
            <div className="flex items-center gap-1.5 w-12 justify-end text-stone-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4 text-stone-900" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {children}
          </div>

          {/* iOS Bottom Home Bar Indicator */}
          <div className="h-5 bg-white/90 backdrop-blur-md flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-stone-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
