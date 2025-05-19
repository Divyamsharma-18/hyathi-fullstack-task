
import React, { useState, useEffect } from 'react';

interface TrainerIntroProps {
  onContinue: () => void;
}

const TrainerIntro: React.FC<TrainerIntroProps> = ({ onContinue }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [allLinesShown, setAllLinesShown] = useState(false);
  
  const dialogLines = [
    "Hey there, future Pokémon trainer! I'm Uddeshya, and I've dedicated my life to rescuing and rehabilitating Pokémon in need.",
    "At Hyathi's Adoption Center, we believe every Pokémon deserves a loving home. Some of our rescued friends are quite special – we even have a Porygon who helps with our website coding!",
    "People often call me the \"Pokémon Whisperer\" because of my unique ability to understand and connect with these amazing creatures. But I believe everyone has this gift; they just need the right opportunity.",
    "Our center isn't just about adoption – it's about creating lasting bonds between trainers and Pokémon. Each adoption story adds another chapter to our growing family."
  ];
  
  // Animate text lines appearing
  useEffect(() => {
    if (visibleLines < dialogLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 1200); // Show a new line every 1.2 seconds
      return () => clearTimeout(timer);
    } else {
      setAllLinesShown(true);
    }
  }, [visibleLines, dialogLines.length]);
  
  // Remove auto-continue after showing all lines
  // We'll now rely on the button click only

  return (
    <div className="night-sky min-h-screen flex flex-col items-center justify-center py-12 relative px-4">
      <div className="max-w-4xl bg-[#152642] border border-blue-700/50 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Trainer Image and Title */}
          <div className="mb-6 md:mb-0 text-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#4285F4] border-4 border-blue-700 rounded-full overflow-hidden flex items-center justify-center mb-3">
              {/* You can add an actual image here if needed */}
              <span className="text-4xl md:text-5xl text-white">U</span>
            </div>
            <h2 className="text-xl md:text-2xl text-blue-300 pokemon-font">Trainer Uddeshya</h2>
            <p className="text-sm text-blue-200 mt-1">Founder & Lead Trainer</p>
          </div>
          
          {/* Dialog Content */}
          <div className="flex-1 relative z-10">
            <div className="space-y-4 text-white">
              {dialogLines.slice(0, visibleLines).map((line, index) => (
                <p 
                  key={index} 
                  className="animate-fade-in"
                >
                  {line}
                </p>
              ))}
            </div>
            
            {/* Continue Button - Always visible but only enabled when all content is shown */}
            <div className="mt-6 flex justify-end">
              <button 
                onClick={onContinue}
                disabled={!allLinesShown}
                className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition-colors uppercase ${
                  !allLinesShown ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerIntro;
