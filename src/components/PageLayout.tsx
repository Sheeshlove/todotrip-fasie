
import { ReactNode } from 'react';
import BottomMenu from './BottomMenu';
import Meta from './Meta';
import ASCIIBackground from './ASCIIBackground';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hideBottomMenu?: boolean;
}

const PageLayout = ({ 
  children, 
  title = 'ToDoTrip - AI Travel App', 
  description = 'AI-powered travel app for planning trips around Russia', 
  hideBottomMenu = false 
}: PageLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-todoBlack font-unbounded text-white relative">
      <ASCIIBackground />
      <Meta title={title} description={description} />
      <main className={`relative z-10 mx-auto max-w-4xl ${isMobile ? 'px-3 py-3 pb-20' : 'px-4 py-4 pb-16'}`}>
        {children}
      </main>
      {!hideBottomMenu && <BottomMenu />}
    </div>
  );
};

export default PageLayout;
