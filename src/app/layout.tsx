// File: src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext'; // 💡 Import the Provider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Library Management System',
  description: 'Full-stack Next.js and Spring Boot application.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 💡 FIX HERE: Wrap the entire application tree with AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}