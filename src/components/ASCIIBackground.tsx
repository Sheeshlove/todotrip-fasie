
import React from 'react';

interface ASCIIBackgroundProps {
  opacity?: number;
}

const ASCIIBackground: React.FC<ASCIIBackgroundProps> = ({ opacity = 0.03 }) => {
  // ASCII art pattern - travel/code themed
  const asciiPattern = `
  ░░░░  ┌─────┐  ┌────┐  ▄▄█▓▓  ░░░░ 
  ░░░░  │ ___ │  │ ** │  ▄▄▄▄▄  ░░░░ 
  ░░░░  └─────┘  └────┘  ▀▀▀▀▀  ░░░░
  ▓▓█▄    << >>    ░░    {[ ]}   ▓▓▓▓  
  ░░░░  [ПУТЬ]   МАРШРУТ  </>    ░░░░ 
  ░░░░  ╔═════╗  ┌────┐  ░░░░   ░░░░ 
  ░░░░  ║ === ║  │ ░░ │  ░▒▒▓▓  ░░░░
  ▒▒▓▓  ╚═════╝  └────┘  ▄▄▄▄▄  ▒▒▓▓  
  ░░░░    [>_]    ░░░░    █▓▒░   ░░░░ 
  `;

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden font-mono text-[8px] sm:text-[10px] text-white"
      style={{ 
        opacity,
        userSelect: 'none',
      }}
    >
      <div className="absolute inset-0 flex flex-wrap overflow-hidden">
        {Array(15).fill(0).map((_, i) => (
          <div key={i} className="w-full whitespace-pre text-center">
            {Array(8).fill(0).map((_, j) => (
              <span key={j} className="inline-block mx-1">
                {asciiPattern}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ASCIIBackground;
