import './globals.css';

export const metadata = {
  title: 'World Cup 2026 Picks',
  description: 'Pick match winners and compete with friends',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-secondary">
        <div className="max-w-lg mx-auto min-h-screen bg-white shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
