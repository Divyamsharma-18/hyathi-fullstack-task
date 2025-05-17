
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TrainerIntroProps {
  onContinue: () => void;
}

const TrainerIntro: React.FC<TrainerIntroProps> = ({ onContinue }) => {
  const [isTyping, setIsTyping] = useState(true);
  const [showButton, setShowButton] = useState(false);

  // Show the continue button after the typing animation completes
  setTimeout(() => {
    setIsTyping(false);
    setTimeout(() => {
      setShowButton(true);
    }, 500);
  }, 4000);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="pixel-card p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Trainer Image */}
          <div className="md:w-1/3 flex flex-col items-center text-center">
            <div className="trainer-avatar mb-4 flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-blue-600"></div>
            </div>
            <h2 className="pokemon-font text-xl mb-1">Trainer Uddeshya</h2>
            <p className="text-blue-300 text-sm">Founder & Lead Trainer</p>
          </div>
          
          {/* Trainer Message */}
          <div className="md:w-2/3 flex flex-col">
            <div className={`${isTyping ? 'typing-animation w-0' : 'w-full'}`}>
              <p className="mb-4 text-white">
                Hey there, future Pokémon trainer! I'm Uddeshya, and I've dedicated my life to rescuing and rehabilitating Pokémon in need.
              </p>
              <p className="mb-4 text-white">
                At Hyathi's Adoption Center, we believe every Pokémon deserves a loving home. Some of our rescued friends are quite special – we even have a Porygon who helps with our website coding!
              </p>
              <p className="mb-4 text-white">
                People often call me the "Pokémon Whisperer" because of my unique ability to understand and connect with these amazing creatures. But I believe everyone has this gift; they just need the right opportunity.
              </p>
              <p className="mb-4 text-white">
                Our center isn't just about adoption – it's about creating lasting bonds between trainers and Pokémon. Each adoption story adds another chapter to our growing family.
              </p>
            </div>
            
            {showButton && (
              <div className="text-center mt-6">
                <button 
                  onClick={onContinue}
                  className="pixel-button"
                >
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerIntro;
