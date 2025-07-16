import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  goal: number;
  progress: number;
}

export const ProgressBar = ({ current, goal, progress }: ProgressBarProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">PS5 Fund Progress</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">₹{current.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">of ₹{goal.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-4 mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{progress.toFixed(1)}% complete</span>
          <span>₹{(goal - current).toLocaleString()} remaining</span>
        </div>
      </div>

      {progress >= 100 && (
        <div className="mt-4 p-4 gradient-primary rounded-lg text-center">
          <div className="text-lg font-bold">🎉 Goal Reached! 🎉</div>
          <div className="text-sm opacity-90">PS5 fund is complete!</div>
        </div>
      )}
    </div>
  );
};