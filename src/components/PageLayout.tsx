
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ASCIIBackground } from './ASCIIBackground';
import BottomMenu from './BottomMenu';

interface PageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, description, children }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="min-h-screen bg-todoBlack text-white overflow-x-hidden">
        <ASCIIBackground />
        <div className="pb-20"> {/* Added padding to the bottom for the menu */}
          {children}
        </div>
        <BottomMenu />
      </div>
    </>
  );
};

export default PageLayout;
