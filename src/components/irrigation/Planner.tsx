import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Clock, Calendar, Lightbulb, Save } from 'lucide-react';
import { crops, soils, seasons, calculateIrrigation, addToHistory, type IrrigationResult } from '@/data/irrigationData';
import { useToast } from '@/hooks/use-toast';

const Planner = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [area, setArea] = useState(100);
  const [result, setResult] = useState<IrrigationResult | null>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    if (!selectedCrop || !selectedSoil || !selectedSeason) {
      toast({ title: 'Please select all fields', variant: 'destructive' });
      return;
    }
    const r = calculateIrrigation(selectedCrop, selectedSoil, selectedSeason, area);
    setResult(r);
  };

  const handleSaveLog = () => {
    if (!result) return;
    addToHistory({
      date: new Date().toISOString().split('T')[0],
      crop: selectedCrop,
      soil: selectedSoil,
      season: selectedSeason,
      waterUsed: result.weeklyTotal,
      area,
    });
    toast({ title: '✅ Irrigation log saved!' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Irrigation Planner</h2>
        <p className="text-muted-foreground mt-1">Select your crop, soil & season</p>
      </div>

      {/* Crop Selection */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">🌾 Select Crop</label>
        <div className="grid grid-cols-4 gap-2">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                selectedCrop === crop.id
                  ? 'border-primary bg-leaf-light shadow-md ring-2 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="text-2xl">{crop.icon}</span>
              <span className="text-[11px] font-medium text-foreground leading-tight text-center">{crop.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Soil Selection */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">🏔️ Select Soil Type</label>
        <div className="grid grid-cols-3 gap-2">
          {soils.map((soil) => (
            <button
              key={soil.id}
              onClick={() => setSelectedSoil(soil.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                selectedSoil === soil.id
                  ? 'border-primary bg-leaf-light shadow-md ring-2 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="text-xl">{soil.icon}</span>
              <span className="text-xs font-medium text-foreground">{soil.name}</span>
              <span className="text-[10px] text-muted-foreground">Retention: {soil.waterRetention}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Season Selection */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">🌦️ Select Season</label>
        <div className="grid grid-cols-4 gap-2">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                selectedSeason === season.id
                  ? 'border-primary bg-leaf-light shadow-md ring-2 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="text-2xl">{season.icon}</span>
              <span className="text-xs font-medium text-foreground">{season.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Area Input */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">📐 Farm Area (sq meters)</label>
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          min={1}
        />
      </div>

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        className="w-full py-6 text-base font-bold rounded-xl shadow-lg"
        size="lg"
      >
        <Droplets className="w-5 h-5 mr-2" />
        Calculate Irrigation Plan
      </Button>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-display font-bold text-foreground">📋 Your Irrigation Plan</h3>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border shadow-sm">
              <CardContent className="p-4 text-center">
                <Droplets className="w-6 h-6 text-water mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Water/m²/day</p>
                <p className="text-xl font-bold text-foreground">{result.waterPerSqM}L</p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Frequency</p>
                <p className="text-lg font-bold text-foreground">{result.frequency}</p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-sun mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Best Time</p>
                <p className="text-lg font-bold text-foreground">{result.bestTime}</p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="p-4 text-center">
                <Droplets className="w-6 h-6 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Weekly Total</p>
                <p className="text-xl font-bold text-foreground">{result.weeklyTotal}L</p>
              </CardContent>
            </Card>
          </div>

          {/* Season Tip */}
          <Card className="border-primary/20 bg-leaf-light">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-foreground mb-1">🌦️ Season Advisory</p>
              <p className="text-sm text-muted-foreground">{result.seasonTip}</p>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-sun" /> Smart Tips
              </h4>
              <ul className="space-y-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSaveLog}
            variant="outline"
            className="w-full py-5 font-semibold rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Save to Irrigation Log
          </Button>
        </div>
      )}
    </div>
  );
};

export default Planner;
