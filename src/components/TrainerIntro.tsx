
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      <Card className="overflow-hidden bg-white shadow-xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Trainer Image */}
            <div className="md:w-1/3 bg-pokemon-blue p-6 flex flex-col items-center justify-center">
              <div className="rounded-full overflow-hidden border-4 border-pokemon-yellow w-48 h-48 mb-4">
                <img 
                  src="https://i.ibb.co/ZW2f6xf/trainer-placeholder.png" 
                  alt="Trainer Uddeshya"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-white text-xl font-bold">Trainer Uddeshya</h2>
              <p className="text-white/80 text-sm">Founder of Hyathi Adoption Center</p>
            </div>
            
            {/* Trainer Message */}
            <div className="md:w-2/3 p-6 md:p-8 flex flex-col">
              <div className={`${isTyping ? 'typing-animation w-0' : 'w-full'}`}>
                <h2 className="text-2xl font-bold mb-4 text-pokemon-blue">Hi, I'm Trainer Uddeshya!</h2>
                <p className="mb-3">
                  Welcome to the Hyathi Pokémon Adoption Center. We've rescued some lonely Pokémon 
                  and they need loving trainers like you!
                </p>
                <p className="mb-3">
                  I started this center after finding many Pokémon abandoned or lost in the wild. 
                  Some of these amazing creatures have special talents - a few can even code! Can you believe it?
                </p>
                <p className="mb-3">
                  Each Pokémon here has its own personality and needs. They require daily care 
                  and feeding to stay healthy and happy.
                </p>
                <p className="mb-6">
                  I'm counting on trainers like you to adopt, care for, and raise them to be
                  strong and happy companions. Are you ready for this responsibility?
                </p>
              </div>
              
              {showButton && (
                <Button 
                  onClick={onContinue}
                  className="bg-pokemon-yellow text-black hover:bg-yellow-400 self-end mt-4 animate-fade-in"
                >
                  Enter Adoption Center
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-pokemon-blue/10 p-6 rounded-lg border border-pokemon-blue/20 animate-text-appear" style={{ animationDelay: "1s" }}>
        <h3 className="font-bold text-lg mb-2">The Hyathi Story</h3>
        <p className="mb-2">
          Trainer Uddeshya has rescued these Pokémon from the wild. They now need new homes.
        </p>
        <p>
          He's counting on you to adopt, care, and raise them to be strong and happy!
        </p>
      </div>
    </div>
  );
};

export default TrainerIntro;
