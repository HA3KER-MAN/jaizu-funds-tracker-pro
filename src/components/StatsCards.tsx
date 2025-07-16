import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, DollarSign } from "lucide-react";

interface StatsCardsProps {
  totalGross: number;
  totalNet: number;
  donationCount: number;
  remaining: number;
}

export const StatsCards = ({ totalGross, totalNet, donationCount, remaining }: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Gross",
      value: `₹${totalGross.toLocaleString()}`,
      subtitle: "Before YouTube cut",
      icon: DollarSign,
      color: "text-blue-400"
    },
    {
      title: "Total Net",
      value: `₹${totalNet.toLocaleString()}`,
      subtitle: "After 30% cut",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      title: "Donations",
      value: donationCount.toString(),
      subtitle: "Total contributions",
      icon: Users,
      color: "text-purple-400"
    },
    {
      title: "Remaining",
      value: `₹${remaining.toLocaleString()}`,
      subtitle: "To reach goal",
      icon: Target,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};