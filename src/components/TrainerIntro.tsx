
import React, { useState, useEffect } from 'react';

interface TrainerIntroProps {
  onContinue: () => void;
}

const TrainerIntro: React.FC<TrainerIntroProps> = ({ onContinue }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [allLinesShown, setAllLinesShown] = useState(false);
  
  const dialogLines = [
    "Hello there! My name is Uddeshya, and I'm a Pokémon rescuer!",
    "Welcome to Hyathi's Pokémon Adoption Center, where we care for abandoned Pokémon.",
    "Many of these wonderful creatures were left behind by trainers who couldn't care for them properly.",
    "Now they need loving homes and trainers who will take good care of them.",
    "Would you like to adopt a Pokémon today and give it the home it deserves?"
  ];
  
  // Animate text lines appearing
  useEffect(() => {
    if (visibleLines < dialogLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 1000); // Show a new line every second
      return () => clearTimeout(timer);
    } else {
      setAllLinesShown(true);
    }
  }, [visibleLines, dialogLines.length]);
  
  // Auto-continue after showing all lines
  useEffect(() => {
    if (allLinesShown) {
      const timer = setTimeout(() => {
        onContinue();
      }, 3000); // Move to next screen after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [allLinesShown, onContinue]);

  return (
    <div className="night-sky min-h-screen flex flex-col items-center justify-center py-12 relative px-4">
      <div className="max-w-4xl flex flex-col md:flex-row items-center gap-8 mt-8">
        {/* Trainer Image */}
        <div className="mb-6 md:mb-0">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0a1128] border-4 border-blue-700 rounded-full overflow-hidden flex items-center justify-center">
            <span className="text-3xl md:text-4xl text-blue-300">U</span>
          </div>
        </div>
        
        {/* Dialog Box */}
        <div className="speech-bubble flex-1 relative z-10 bg-[#152642] border border-blue-700/50">
          <h2 className="text-xl md:text-2xl text-blue-300 mb-4 pokemon-font">Trainer Uddeshya</h2>
          <div className="space-y-3 text-white">
            {dialogLines.slice(0, visibleLines).map((line, index) => (
              <p 
                key={index} 
                className="animate-fade-in"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerIntro;
