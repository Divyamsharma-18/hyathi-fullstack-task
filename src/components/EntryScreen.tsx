
import React, { useState, useEffect } from 'react';

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
        className={`text-center mb-12 transition-opacity duration-1000 ${
          showWelcomeText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="pixelated-heading text-2xl md:text-4xl mb-2">
          Welcome to Hyathi's
        </h1>
        <h1 className="pixelated-heading text-2xl md:text-4xl">
          Pokémon Adoption Center
        </h1>
      </div>
      
      {/* Enter button */}
      {showEnterButton && (
        <button
          onClick={onEnter}
          className="pixel-button animate-pulse mt-8"
        >
          ✨ ENTER THE ADOPTION CENTER
        </button>
      )}
    </div>
  );
};

export default EntryScreen;
