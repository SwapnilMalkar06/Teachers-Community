'use client';

import { useEffect, useRef } from 'react';

interface TrackerProps {
  postId: string;
}

export default function EngagementTracker({ postId }: TrackerProps) {
  const activeSeconds = useRef<number>(0);

  useEffect(() => {
    // 1. Send initial view increment
    fetch('/api/blog/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, incrementView: true }),
    }).catch(() => {});

    // 2. Active timer & Heartbeat (15s interval)
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        activeSeconds.current += 5;
      }
    }, 5000);

    const heartbeat = setInterval(() => {
      if (activeSeconds.current > 0) {
        const secsToReport = activeSeconds.current;
        activeSeconds.current = 0;

        fetch('/api/blog/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, timeSpentSeconds: secsToReport }),
        }).catch(() => {});
      }
    }, 15000);

    // 3. Unload / tab hide handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && activeSeconds.current > 0) {
        const secsToReport = activeSeconds.current;
        activeSeconds.current = 0;

        navigator.sendBeacon(
          '/api/blog/analytics',
          JSON.stringify({ postId, timeSpentSeconds: secsToReport })
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [postId]);

  return null;
}
