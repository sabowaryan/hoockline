import React, { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/Breadcrumb';
import { QuickNavigation } from '../components/QuickNavigation';

interface LayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
      <Navbar />
      <Breadcrumb />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <QuickNavigation />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}