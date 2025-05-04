
import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ASCIIBackgroundProps {
  opacity?: number;
}

// Memoized version of ASCIIBackground to prevent unnecessary re-renders
const ASCIIBackground: React.FC<ASCIIBackgroundProps> = memo(({ opacity = 0.03 }) => {
  const isMobile = useIsMobile();
  
  // Simplified pattern with less repetition for better performance
  const asciiPattern = `
  ░░░░  ┌─────┐  ▄▄█▓▓  ░░░░ 
  ░░░░  │ ___ │  ▄▄▄▄▄  ░░░░ 
  ░░░░  └─────┘  ▀▀▀▀▀  ░░░░
  ▓▓█▄    << >>   {[ ]}   ▓▓▓▓  
  ░░░░  [ПУТЬ]   </>    ░░░░ 
  ░░░░  ╔═════╗  ░░░░   ░░░░ 
  ░░░░  ║ === ║  ░▒▒▓▓  ░░░░
  ▒▒▓▓  ╚═════╝  ▄▄▄▄▄  ▒▒▓▓  
  `;

  // Reduce number of elements for mobile
  const repeatCount = isMobile ? 5 : 10;
  const lineCount = isMobile ? 7 : 12;

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden font-mono text-[8px] sm:text-[10px] text-white"
      style={{ 
        opacity,
        userSelect: 'none',
      }}
    >
      <div className="absolute inset-0 flex flex-wrap overflow-hidden">
        {Array(lineCount).fill(0).map((_, i) => (
          <div key={i} className="w-full whitespace-pre text-center">
            {Array(repeatCount).fill(0).map((_, j) => (
              <span key={j} className="inline-block mx-1">
                {asciiPattern}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

// Add display name for React DevTools
ASCIIBackground.displayName = 'ASCIIBackground';

export default ASCIIBackground;
