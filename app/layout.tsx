import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Foboh Sales App',
  description: 'Sales management application for Foboh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="__next" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
} 