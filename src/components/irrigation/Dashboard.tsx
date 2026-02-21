import { Droplets, Sun, CloudRain, Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { seasons, crops, getHistory } from '@/data/irrigationData';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const history = getHistory();
  const today = new Date();
  const month = today.getMonth();
  
  // Auto-detect season
  const currentSeason = month >= 2 && month <= 4 ? seasons[3] // spring
    : month >= 5 && month <= 7 ? seasons[0] // summer
    : month >= 8 && month <= 9 ? seasons[2] // monsoon
    : seasons[1]; // winter

  const totalWaterUsed = history.reduce((sum, log) => sum + log.waterUsed, 0);
  const todayLogs = history.filter(l => l.date === today.toISOString().split('T')[0]);

  const quickStats = [
    { label: 'Season', value: currentSeason.name, icon: currentSeason.icon, color: 'bg-sun/10 text-sun-foreground' },
    { label: 'Total Logs', value: history.length.toString(), icon: '📋', color: 'bg-water-light text-water' },
    { label: 'Water Used', value: `${Math.round(totalWaterUsed)}L`, icon: '💧', color: 'bg-leaf-light text-leaf' },
    { label: "Today's Logs", value: todayLogs.length.toString(), icon: '📅', color: 'bg-secondary text-secondary-foreground' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
        </h2>
        <p className="text-muted-foreground mt-1">Here's your irrigation overview</p>
      </div>

      {/* Season Banner */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="gradient-hero p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Current Season</p>
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                {currentSeason.icon} {currentSeason.name}
              </h3>
              <p className="text-sm mt-2 opacity-90 max-w-xs">{currentSeason.tip}</p>
            </div>
            <div className="text-5xl">{currentSeason.icon}</div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-display font-bold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('planner')}
            className="p-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-3 shadow-md hover:shadow-lg transition-shadow"
          >
            <Droplets className="w-5 h-5" />
            Plan Irrigation
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="p-4 rounded-xl bg-secondary text-secondary-foreground font-semibold flex items-center gap-3 shadow-md hover:shadow-lg transition-shadow"
          >
            <Thermometer className="w-5 h-5" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Tips */}
      <Card className="border shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
            <Sun className="w-5 h-5 text-sun" /> Today's Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CloudRain className="w-4 h-4 mt-0.5 text-water" />
              <span>{currentSeason.tip}</span>
            </li>
            <li className="flex items-start gap-2">
              <Droplets className="w-4 h-4 mt-0.5 text-primary" />
              <span>Check soil moisture 2-3 inches deep before watering</span>
            </li>
            <li className="flex items-start gap-2">
              <Sun className="w-4 h-4 mt-0.5 text-sun" />
              <span>Best time to irrigate: Early morning (6-8 AM)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Popular Crops */}
      <div>
        <h3 className="text-lg font-display font-bold text-foreground mb-3">Popular Crops</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {crops.slice(0, 5).map((crop) => (
            <button
              key={crop.id}
              onClick={() => onNavigate('planner')}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow min-w-[80px]"
            >
              <span className="text-3xl">{crop.icon}</span>
              <span className="text-xs font-medium text-foreground">{crop.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
