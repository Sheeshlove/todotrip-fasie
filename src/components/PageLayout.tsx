
import { ReactNode } from 'react';
import BottomMenu from './BottomMenu';
import Meta from './Meta';

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
  return (
    <div className="min-h-screen bg-todoBlack font-unbounded text-white pb-16">
      <Meta title={title} description={description} />
      <main className="px-4 py-4 max-w-4xl mx-auto">{children}</main>
      {!hideBottomMenu && <BottomMenu />}
    </div>
  );
};

export default PageLayout;
