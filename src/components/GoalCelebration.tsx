import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

interface GoalCelebrationProps {
  isVisible: boolean;
}

export const GoalCelebration = ({ isVisible }: GoalCelebrationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="glass-card p-8 text-center max-w-md mx-4 animate-scale-in">
        <div className="animate-confetti text-6xl mb-4">🎮</div>
        <h2 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
          PS5 Goal Reached!
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          Congratulations! The PlayStation 5 fund is now complete!
        </p>
        <div className="flex justify-center gap-2 text-2xl">
          <span className="animate-bounce">🎉</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🥳</span>
        </div>
      </Card>
    </div>
  );
};