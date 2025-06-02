'use client';

import { useEffect } from 'react';

export default function PlanPage() {
  useEffect(() => {
    // Redirect to home page since plan is the main screen
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Redirecting to main plan view...</p>
    </div>
  );
} 