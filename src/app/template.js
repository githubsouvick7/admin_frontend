import AppSidebar from '@/components/layout/appSidebar';
import { ReactNode } from 'react';

export default function Template({ children }) {

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-scroll">
        <div className="container py-6 px-4 md:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
