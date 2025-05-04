
import React from 'react';
import Meta from './Meta';
import SecurityHeaders from './SecurityHeaders';
import { sanitize } from '@/utils/securityUtils';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  noIndex?: boolean;
  image?: string;
  type?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  description,
  noIndex = false,
  image,
  type = "website"
}) => {
  // Sanitize inputs for security
  const sanitizedTitle = sanitize.xss(title);
  const sanitizedDescription = sanitize.xss(description || '');
  const sanitizedImage = image ? sanitize.url(image) : undefined;

  return (
    <>
      <Meta
        title={sanitizedTitle}
        description={sanitizedDescription}
        noIndex={noIndex}
        image={sanitizedImage}
        type={type}
      />
      
      {/* Add security headers */}
      <SecurityHeaders />
      
      <div className="min-h-screen bg-todoBlack flex flex-col">
        {children}
      </div>
    </>
  );
};

export default PageLayout;
