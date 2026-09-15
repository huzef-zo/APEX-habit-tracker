import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Nilex Fashion House',
  description: 'Nilex Fashion House menswear collection',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
