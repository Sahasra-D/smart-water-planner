import { Card, CardContent } from '@/components/ui/card';
import { getHistory, crops, soils, seasons } from '@/data/irrigationData';
import { Droplets, Trash2 } from 'lucide-react';
import { clearHistory } from '@/data/irrigationData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ScheduleView = () => {
  const [history, setHistory] = useState(getHistory());
  
  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  // Group by date
  const grouped = history.reduce<Record<string, typeof history>>((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Schedule & Logs</h2>
          <p className="text-muted-foreground mt-1">Your irrigation history</p>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive">
            <Trash2 className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="border shadow-sm">
          <CardContent className="p-8 text-center">
            <Droplets className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground font-medium">No irrigation logs yet</p>
            <p className="text-sm text-muted-foreground mt-1">Go to Planner to create your first plan</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([date, logs]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{formatDate(date)}</h3>
            <div className="space-y-2">
              {logs.map((log) => {
                const crop = crops.find(c => c.id === log.crop);
                const soil = soils.find(s => s.id === log.soil);
                const season = seasons.find(s => s.id === log.season);
                return (
                  <Card key={log.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{crop?.icon || '🌱'}</span>
                          <div>
                            <p className="font-semibold text-foreground">{crop?.name || log.crop}</p>
                            <p className="text-xs text-muted-foreground">
                              {soil?.name} soil · {season?.name} · {log.area}m²
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-water">{log.waterUsed}L</p>
                          <p className="text-[10px] text-muted-foreground">weekly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduleView;
