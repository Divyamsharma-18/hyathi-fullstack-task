
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface TrainerIntroProps {
  onContinue: () => void;
}

const TrainerIntro: React.FC<TrainerIntroProps> = ({ onContinue }) => {
  const [stars, setStars] = useState<{top: string, left: string, animation: string}[]>([]);
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [showButton, setShowButton] = useState(false);
  
  // Text content to animate
  const paragraphs = [
    "Hey there, future Pokémon trainer! I'm Uddeshya, and I've dedicated my life to rescuing and rehabilitating Pokémon in need.",
    "At Hyathi's Adoption Center, we believe every Pokémon deserves a loving home. Some of our rescued friends are quite special – we even have a Porygon who helps with our website coding!",
    "People often call me the \"Pokémon Whisperer\" because of my unique ability to understand and connect with these amazing creatures. But I believe everyone has this gift; they just need the right opportunity.",
    "Our center isn't just about adoption – it's about creating lasting bonds between trainers and Pokémon. Each adoption story adds another chapter to our growing family."
  ];

  // Generate random stars for background
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 5}s`
    }));
    setStars(newStars);
  }, []);

  // Animation for text appearance
  useEffect(() => {
    // Show paragraphs one by one with slight delay
    const timer = setInterval(() => {
      setVisibleParagraphs(prev => {
        if (prev < paragraphs.length) {
          return prev + 1;
        }
        clearInterval(timer);
        
        // Show button after all paragraphs are displayed
        setTimeout(() => {
          setShowButton(true);
        }, 500);
        
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paragraphs.length]);

  return (
    <div className="night-sky min-h-screen py-4 relative overflow-hidden">
      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={`star-${i}`}
          className="star"
          style={{ 
            top: star.top, 
            left: star.left, 
            animation: star.animation 
          }}
        />
      ))}
    
      <div className="max-w-4xl mx-auto p-4 md:p-8 z-10 relative">
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
              {paragraphs.map((paragraph, index) => (
                <p 
                  key={index}
                  className={`mb-4 text-white transition-opacity duration-300 ${
                    index < visibleParagraphs ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
              
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
    </div>
  );
};

export default TrainerIntro;
