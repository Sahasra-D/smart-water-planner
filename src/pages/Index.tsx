import { useState } from 'react';
import { Droplets, Sprout, BarChart3, Calendar, Leaf } from 'lucide-react';
import Dashboard from '@/components/irrigation/Dashboard';
import Planner from '@/components/irrigation/Planner';
import ScheduleView from '@/components/irrigation/ScheduleView';
import Analytics from '@/components/irrigation/Analytics';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: Sprout },
  { id: 'planner', label: 'Plan', icon: Droplets },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-hero px-4 py-5 text-primary-foreground">
        <div className="container max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold">AquaCrop Planner</h1>
            <p className="text-sm opacity-80">Smart Irrigation for Better Harvests</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6 pb-24">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'planner' && <Planner />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'analytics' && <Analytics />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="container max-w-4xl mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse-soft' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;
