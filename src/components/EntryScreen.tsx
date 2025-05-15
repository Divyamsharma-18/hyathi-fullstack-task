
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface EntryScreenProps {
  onEnter: () => void;
}

const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter }) => {
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [stars, setStars] = useState<{top: string, left: string, animation: string}[]>([]);
  const [fireflies, setFireflies] = useState<{top: string, left: string, animation: string}[]>([]);

  // Generate random stars
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 5}s`
    }));
    setStars(newStars);
    
    // Generate fireflies
    const newFireflies = Array.from({ length: 30 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `float ${8 + Math.random() * 7}s ease-in-out infinite ${Math.random() * 5}s`
    }));
    setFireflies(newFireflies);
    
    // Show welcome text after loading
    setTimeout(() => {
      setShowWelcomeText(true);
    }, 500);
    
    // Show enter button after delay
    setTimeout(() => {
      setShowEnterButton(true);
    }, 2500);
  }, []);

  return (
    <div className="fixed inset-0 night-sky flex flex-col items-center justify-center overflow-hidden">
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
      
      {/* Fireflies */}
      {fireflies.map((firefly, i) => (
        <div
          key={`firefly-${i}`}
          className="firefly"
          style={{ 
            top: firefly.top, 
            left: firefly.left, 
            animation: firefly.animation 
          }}
        />
      ))}
      
      {/* Welcome text */}
      <div 
        className={`text-center mb-8 transition-opacity duration-1000 ${
          showWelcomeText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-white text-3xl md:text-4xl font-bold pokemon-font">
          Welcome to Hyathi's Pokémon Adoption Center...
        </h1>
      </div>
      
      {/* Enter button */}
      <div 
        className={`transition-opacity duration-1000 ${
          showEnterButton ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          onClick={onEnter}
          className="text-lg bg-pokemon-yellow text-black hover:bg-yellow-400 px-8 py-6 rounded-xl font-bold animate-pulse-glow"
        >
          Enter the Adoption Center
        </Button>
      </div>
    </div>
  );
};

export default EntryScreen;
