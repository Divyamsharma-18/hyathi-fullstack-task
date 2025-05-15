
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const TubaFairy: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (user?.lastTubaReward) {
      updateTimeRemaining();
      const timer = setInterval(updateTimeRemaining, 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [user]);

  const updateTimeRemaining = () => {
    if (!user?.lastTubaReward) return;
    
    const lastReward = new Date(user.lastTubaReward);
    const currentTime = new Date();
    
    // Add 10 hours to last reward time
    const nextRewardTime = new Date(lastReward.getTime() + 10 * 60 * 60 * 1000);
    
    // Calculate time difference
    const diff = nextRewardTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) {
      setTimeRemaining('Ready to collect!');
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    }
  };

  const collectReward = async () => {
    try {
      setIsLoading(true);
      const response = await mockApiService.collectTubaReward();
      updateUser(response.user);
      
      toast({
        title: "Fairy Tuba",
        description: response.message,
      });
      
      // Play coin sound
      const coinSound = new Audio('/coin.mp3');
      coinSound.volume = 0.5;
      coinSound.play().catch(error => console.error('Error playing sound:', error));
      
      updateTimeRemaining();
    } catch (error: any) {
      toast({
        title: "Fairy Tuba",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canCollect = timeRemaining === 'Ready to collect!';

  return (
    <Card 
      className={`overflow-hidden shadow-lg transition-all border-2 ${
        canCollect ? 'border-pokemon-gold animate-pulse-glow' : 'border-purple-300'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-b from-purple-100 to-purple-300"
              style={{
                transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.5s ease-in-out'
              }}
            />
            <img 
              src="https://i.ibb.co/2WNz3XF/fairy-tuba.png"
              alt="Fairy Tuba"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-auto"
              style={{
                transform: isHovering 
                  ? 'translate(-50%, 0) scale(1.05)' 
                  : 'translate(-50%, 0)',
                transition: 'transform 0.5s ease-in-out'
              }}
            />
            <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full px-3 py-1 text-xs font-bold">
              Fairy
            </div>
          </div>
          
          <div className="p-4 w-full">
            <h3 className="font-bold text-lg mb-1 text-purple-700">Fairy Tuba</h3>
            
            <p className="text-sm text-gray-600 mb-3">
              Visit Fairy Tuba every 10 hours to receive 5 coins!
            </p>
            
            {timeRemaining && (
              <div className="mb-3 text-center text-sm">
                <span className={canCollect ? 'text-green-600 font-bold' : 'text-gray-500'}>
                  {timeRemaining}
                </span>
              </div>
            )}
            
            <Button 
              className={`w-full ${
                canCollect 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              disabled={!canCollect || isLoading}
              onClick={collectReward}
            >
              <Coins className="w-4 h-4 mr-2" />
              Collect 5 Coins
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TubaFairy;
