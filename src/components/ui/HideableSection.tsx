import React from 'react';
import { cn } from '@/lib/utils';

interface HideableSectionProps {
  sectionId: string;
  children: React.ReactNode;
  className?: string;
}

const HideableSection: React.FC<HideableSectionProps> = ({
  sectionId,
  children,
  className,
}) => {
  return (
    <div id={sectionId} className={cn("min-h-screen relative print-section", className)}>
      {children}
    </div>
  );
};

export default HideableSection;