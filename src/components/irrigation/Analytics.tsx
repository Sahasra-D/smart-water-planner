import { Card, CardContent } from '@/components/ui/card';
import { getHistory, crops } from '@/data/irrigationData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Droplets, TrendingUp, BarChart3 } from 'lucide-react';

const COLORS = ['#2d9e5f', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const Analytics = () => {
  const history = getHistory();

  // Water by crop
  const cropWater = history.reduce<Record<string, number>>((acc, log) => {
    const crop = crops.find(c => c.id === log.crop);
    const name = crop?.name || log.crop;
    acc[name] = (acc[name] || 0) + log.waterUsed;
    return acc;
  }, {});

  const pieData = Object.entries(cropWater).map(([name, value]) => ({ name, value: Math.round(value) }));

  // Water by date (last 7 entries)
  const dateWater = history.slice(0, 14).reduce<Record<string, number>>((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.waterUsed;
    return acc;
  }, {});

  const barData = Object.entries(dateWater)
    .map(([date, water]) => ({
      date: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      water: Math.round(water),
    }))
    .reverse();

  const totalWater = history.reduce((sum, l) => sum + l.waterUsed, 0);
  const avgPerLog = history.length ? Math.round(totalWater / history.length) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground mt-1">Track your water usage</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border shadow-sm">
          <CardContent className="p-3 text-center">
            <Droplets className="w-5 h-5 text-water mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Total Used</p>
            <p className="text-lg font-bold text-foreground">{Math.round(totalWater)}L</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Avg/Plan</p>
            <p className="text-lg font-bold text-foreground">{avgPerLog}L</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-3 text-center">
            <BarChart3 className="w-5 h-5 text-sun mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Total Plans</p>
            <p className="text-lg font-bold text-foreground">{history.length}</p>
          </CardContent>
        </Card>
      </div>

      {history.length === 0 ? (
        <Card className="border shadow-sm">
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground font-medium">No data yet</p>
            <p className="text-sm text-muted-foreground mt-1">Save irrigation plans to see analytics</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Bar Chart */}
          {barData.length > 0 && (
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-display font-bold text-foreground mb-4">💧 Water Usage Trend</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="water" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-display font-bold text-foreground mb-4">🌾 Water by Crop</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}L`}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;
