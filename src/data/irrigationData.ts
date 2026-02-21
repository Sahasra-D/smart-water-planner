export interface CropData {
  id: string;
  name: string;
  icon: string;
  waterNeedPerSqM: number; // liters per sq meter per day
  irrigationFrequency: string;
  optimalTime: string;
  growthDuration: string;
  description: string;
}

export interface SoilData {
  id: string;
  name: string;
  icon: string;
  waterRetention: 'low' | 'medium' | 'high';
  drainageRate: 'fast' | 'moderate' | 'slow';
  multiplier: number;
  description: string;
}

export interface SeasonData {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
  tip: string;
}

export interface IrrigationResult {
  waterPerSqM: number;
  frequency: string;
  bestTime: string;
  tips: string[];
  seasonTip: string;
  weeklyTotal: number;
}

export interface IrrigationLog {
  id: string;
  date: string;
  crop: string;
  soil: string;
  season: string;
  waterUsed: number;
  area: number;
}

export const crops: CropData[] = [
  { id: 'rice', name: 'Rice', icon: '🌾', waterNeedPerSqM: 8, irrigationFrequency: 'Daily', optimalTime: '6:00 AM', growthDuration: '120-150 days', description: 'High water requirement, needs standing water' },
  { id: 'wheat', name: 'Wheat', icon: '🌿', waterNeedPerSqM: 4, irrigationFrequency: 'Every 3-4 days', optimalTime: '7:00 AM', growthDuration: '100-130 days', description: 'Moderate water needs' },
  { id: 'corn', name: 'Corn', icon: '🌽', waterNeedPerSqM: 5.5, irrigationFrequency: 'Every 2-3 days', optimalTime: '6:30 AM', growthDuration: '80-100 days', description: 'Consistent moisture needed' },
  { id: 'tomato', name: 'Tomato', icon: '🍅', waterNeedPerSqM: 4.5, irrigationFrequency: 'Every 2 days', optimalTime: '7:00 AM', growthDuration: '60-85 days', description: 'Even watering prevents cracking' },
  { id: 'potato', name: 'Potato', icon: '🥔', waterNeedPerSqM: 5, irrigationFrequency: 'Every 3 days', optimalTime: '6:00 AM', growthDuration: '70-120 days', description: 'Deep watering promotes tuber growth' },
  { id: 'cotton', name: 'Cotton', icon: '☁️', waterNeedPerSqM: 6, irrigationFrequency: 'Every 3-5 days', optimalTime: '6:00 AM', growthDuration: '150-180 days', description: 'Drought-tolerant but needs water at flowering' },
  { id: 'sugarcane', name: 'Sugarcane', icon: '🎋', waterNeedPerSqM: 7, irrigationFrequency: 'Every 2-3 days', optimalTime: '6:30 AM', growthDuration: '270-365 days', description: 'Heavy water requirement throughout growth' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', waterNeedPerSqM: 3.5, irrigationFrequency: 'Daily', optimalTime: '7:00 AM', growthDuration: '30-90 days', description: 'Shallow roots need frequent watering' },
];

export const soils: SoilData[] = [
  { id: 'sandy', name: 'Sandy', icon: '🏜️', waterRetention: 'low', drainageRate: 'fast', multiplier: 1.3, description: 'Drains quickly, needs more frequent watering' },
  { id: 'clay', name: 'Clay', icon: '🧱', waterRetention: 'high', drainageRate: 'slow', multiplier: 0.7, description: 'Retains water well, risk of waterlogging' },
  { id: 'loamy', name: 'Loamy', icon: '🌱', waterRetention: 'medium', drainageRate: 'moderate', multiplier: 1.0, description: 'Ideal balance of drainage and retention' },
  { id: 'silty', name: 'Silty', icon: '🏔️', waterRetention: 'medium', drainageRate: 'moderate', multiplier: 0.9, description: 'Good moisture retention, fertile soil' },
  { id: 'peaty', name: 'Peaty', icon: '🌿', waterRetention: 'high', drainageRate: 'slow', multiplier: 0.6, description: 'Very high moisture, acidic' },
  { id: 'chalky', name: 'Chalky', icon: '⚪', waterRetention: 'low', drainageRate: 'fast', multiplier: 1.2, description: 'Alkaline, drains quickly' },
];

export const seasons: SeasonData[] = [
  { id: 'summer', name: 'Summer', icon: '☀️', multiplier: 1.3, tip: 'Increase watering during heat waves. Water early morning or late evening to reduce evaporation.' },
  { id: 'winter', name: 'Winter', icon: '❄️', multiplier: 0.7, tip: 'Reduce watering as soil retains moisture longer. Avoid watering during frost.' },
  { id: 'monsoon', name: 'Monsoon', icon: '🌧️', multiplier: 0.4, tip: 'Skip irrigation on rainy days. Ensure proper drainage to prevent waterlogging.' },
  { id: 'spring', name: 'Spring', icon: '🌸', multiplier: 1.0, tip: 'Regular watering schedule. Great time for planting new crops.' },
];

export function calculateIrrigation(
  cropId: string,
  soilId: string,
  seasonId: string,
  areaSqM: number
): IrrigationResult {
  const crop = crops.find(c => c.id === cropId)!;
  const soil = soils.find(s => s.id === soilId)!;
  const season = seasons.find(s => s.id === seasonId)!;

  const waterPerSqM = Math.round(crop.waterNeedPerSqM * soil.multiplier * season.multiplier * 10) / 10;
  const dailyTotal = waterPerSqM * areaSqM;
  
  const tips: string[] = [];
  
  if (season.id === 'monsoon') tips.push('🌧️ Reduce watering during rainy days');
  if (season.id === 'summer') tips.push('☀️ Water early morning (before 8 AM) to minimize evaporation');
  if (soil.waterRetention === 'low') tips.push('💧 Sandy soil dries quickly — consider mulching');
  if (soil.waterRetention === 'high') tips.push('⚠️ Be careful of waterlogging with this soil type');
  if (crop.waterNeedPerSqM > 6) tips.push('🚿 This crop has high water needs — ensure consistent supply');
  tips.push('📏 Check soil moisture 2-3 inches deep before watering');
  tips.push('🌅 Best to irrigate in early morning for optimal absorption');

  // Estimate weekly frequency
  let daysPerWeek = 7;
  if (crop.irrigationFrequency.includes('2-3')) daysPerWeek = 3;
  else if (crop.irrigationFrequency.includes('3-4')) daysPerWeek = 2;
  else if (crop.irrigationFrequency.includes('3-5')) daysPerWeek = 2;
  else if (crop.irrigationFrequency === 'Daily') daysPerWeek = 7;
  
  if (season.id === 'monsoon') daysPerWeek = Math.max(1, Math.round(daysPerWeek * 0.5));
  if (season.id === 'winter') daysPerWeek = Math.max(1, Math.round(daysPerWeek * 0.7));

  return {
    waterPerSqM,
    frequency: crop.irrigationFrequency,
    bestTime: crop.optimalTime,
    tips,
    seasonTip: season.tip,
    weeklyTotal: Math.round(dailyTotal * daysPerWeek),
  };
}

// LocalStorage helpers
const HISTORY_KEY = 'irrigation_history';

export function getHistory(): IrrigationLog[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addToHistory(log: Omit<IrrigationLog, 'id'>): void {
  const history = getHistory();
  history.unshift({ ...log, id: Date.now().toString() });
  // Keep last 100 entries
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
