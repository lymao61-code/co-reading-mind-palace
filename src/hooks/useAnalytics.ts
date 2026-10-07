import { useEffect, useRef } from 'react';

export const useAnalytics = () => {
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    let id = localStorage.getItem('analytics_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('analytics_session_id', id);
    }
    sessionIdRef.current = id;
  }, []);

  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/analytics/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        });
      } catch (e) {
        console.error('Analytics heartbeat failed', e);
      }
    };

    // Send initial heartbeat
    sendHeartbeat();

    // Send heartbeat every 30 seconds
    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, []);
};
