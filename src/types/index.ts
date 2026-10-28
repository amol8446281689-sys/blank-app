export type Language = 'mr' | 'en';

export interface WeatherData {
  city: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  isDay: boolean;
  daily: {
    dates: string[];
    maxTemps: number[];
    minTemps: number[];
    rainProb: number[];
    weatherCodes: number[];
  };
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface KhataContact {
  id: string;
  name: string;
  phone?: string;
  balance: number; // positive = they owe you (येणे), negative = you owe them (देणे)
  lastUpdated: string;
  history: {
    id: string;
    type: 'given' | 'received'; // given = दिला, received = आला
    amount: number;
    note: string;
    date: string;
  }[];
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'farming' | 'finance' | 'personal' | 'work';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
}

export interface CropPrice {
  nameMr: string;
  nameEn: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  change: number; // percentage
  topMarketMr: string;
  topMarketEn: string;
  trend: 'up' | 'down' | 'stable';
}
