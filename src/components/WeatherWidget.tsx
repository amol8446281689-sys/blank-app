import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, RefreshCw, MapPin, AlertCircle, Compass, Thermometer } from 'lucide-react';
import { MAHARASHTRA_CITIES, CityLocation } from '../data/maharashtraData';
import { Language, WeatherData } from '../types';

interface Props {
  lang: Language;
}

export function WeatherWidget({ lang }: Props) {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(MAHARASHTRA_CITIES[0]); // Pune default
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: CityLocation) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch weather data');
      const data = await res.json();

      setWeather({
        city: lang === 'mr' ? city.nameMr : city.nameEn,
        temperature: Math.round(data.current.temperature_2m),
        apparentTemperature: Math.round(data.current.apparent_temperature),
        weatherCode: data.current.weather_code,
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        precipitationProbability: data.daily?.precipitation_probability_max?.[0] || 0,
        isDay: data.current.is_day === 1,
        daily: {
          dates: data.daily.time,
          maxTemps: data.daily.temperature_2m_max.map((t: number) => Math.round(t)),
          minTemps: data.daily.temperature_2m_min.map((t: number) => Math.round(t)),
          rainProb: data.daily.precipitation_probability_max,
          weatherCodes: data.daily.weather_code,
        }
      });
    } catch {
      setError(lang === 'mr' ? 'हवामान माहिती मिळवण्यात अडचण आली' : 'Unable to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, lang]);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return { mr: 'निरभ्र आकाश (Clear)', en: 'Clear sky' };
    if (code === 1 || code === 2) return { mr: 'अंशतः ढगाळ (Partly Cloudy)', en: 'Partly cloudy' };
    if (code === 3) return { mr: 'ढगाळ वातावरण (Overcast)', en: 'Overcast' };
    if (code >= 45 && code <= 48) return { mr: 'धुके (Foggy)', en: 'Foggy' };
    if (code >= 51 && code <= 55) return { mr: 'हलकी रिमझिम पाऊस (Drizzle)', en: 'Light drizzle' };
    if (code >= 61 && code <= 65) return { mr: 'पावसाची शक्यता (Rain)', en: 'Rainy' };
    if (code >= 80 && code <= 82) return { mr: 'जोरदार पाऊस (Showers)', en: 'Heavy showers' };
    if (code >= 95) return { mr: 'विजांसह वादळी पाऊस (Thunderstorm)', en: 'Thunderstorm' };
    return { mr: 'सामान्य हवामान (Moderate)', en: 'Moderate' };
  };

  // Farming advisory based on weather
  const getFarmingTip = (temp: number, humidity: number, rainProb: number) => {
    if (rainProb > 50) {
      return lang === 'mr'
        ? '🌧️ पावसाची शक्यता आहे: कीटकनाशक फवारणी किंवा खत घालणे २ दिवस पुढे ढकला. पाण्याचा निचरा नीट ठेवा.'
        : '🌧️ Rain expected: Postpone pesticide spraying or fertilizer application. Ensure proper field drainage.';
    }
    if (temp > 35) {
      return lang === 'mr'
        ? '☀️ कडक ऊन: पिकांना ठिबक किंवा हलके पाणी सायंकाळी द्या. जनावरांना सावलीत ठेवा.'
        : '☀️ High Heat: Irrigate crops during evening hours to minimize evaporation. Keep livestock in shade.';
    }
    if (humidity > 80) {
      return lang === 'mr'
        ? '💧 जास्त आर्द्रता: बुरशीजन्य रोगांचा प्रादुर्भाव होऊ शकतो. पिकांचे नियमित निरीक्षण करा.'
        : '💧 High Humidity: Watch out for fungal diseases and leaf spot. Inspect crops regularly.';
    }
    return lang === 'mr'
      ? '🌾 हवामान अनुकूल आहे: आंतरमशागत, खुरपणी व नियमित पाणी व्यवस्थापनासाठी योग्य वेळ.'
      : '🌾 Favorable Weather: Ideal time for intercultural operations, weeding, and routine irrigation.';
  };

  return (
    <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {lang === 'mr' ? 'लाईव्ह हवामान व शेती सल्ला' : 'Live Weather & Agri Advisory'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lang === 'mr' ? 'महाराष्ट्रातील प्रमुख जिल्ह्यांचा अचूक अंदाज' : 'Live forecast for Maharashtra districts'}
            </p>
          </div>
        </div>

        {/* City Selector */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#ff4b4b] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCity.nameEn}
              onChange={(e) => {
                const found = MAHARASHTRA_CITIES.find(c => c.nameEn === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="pl-8 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#252a35] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {MAHARASHTRA_CITIES.map(c => (
                <option key={c.nameEn} value={c.nameEn}>
                  {lang === 'mr' ? c.nameMr : c.nameEn} ({lang === 'mr' ? c.districtMr : c.districtEn})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchWeather(selectedCity)}
            disabled={loading}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
            title={lang === 'mr' ? 'रिफ्रेश करा' : 'Refresh weather'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && !weather ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-sm text-gray-500">{lang === 'mr' ? 'हवामान माहिती लोड होत आहे...' : 'Loading weather data...'}</p>
        </div>
      ) : error ? (
        <div className="py-8 flex items-center justify-center text-red-500 text-sm gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : weather ? (
        <div className="mt-5 space-y-6">
          {/* Main Weather Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-amber-500/10 border border-sky-100 dark:border-sky-900/40">
            {/* Left: Temp and Status */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-amber-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                {weather.precipitationProbability > 40 ? (
                  <CloudRain className="w-8 h-8" />
                ) : weather.weatherCode >= 1 && weather.weatherCode <= 3 ? (
                  <Cloud className="w-8 h-8" />
                ) : (
                  <Sun className="w-8 h-8" />
                )}
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-gray-100">
                    {weather.temperature}°
                  </span>
                  <span className="text-base font-semibold text-gray-500">C</span>
                </div>
                <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                  {getWeatherDescription(weather.weatherCode)[lang]}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <Thermometer className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'mr' ? 'जाणवणारे तापमान:' : 'Feels like:'} {weather.apparentTemperature}°C</span>
                </p>
              </div>
            </div>

            {/* Middle: Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 md:py-0 border-y md:border-y-0 md:border-x border-gray-200 dark:border-gray-800/80 px-0 md:px-4">
              <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-white/70 dark:bg-[#12151c]/60">
                <Droplets className="w-4 h-4 text-blue-500 mb-1" />
                <span className="text-[11px] text-gray-500">{lang === 'mr' ? 'आर्द्रता' : 'Humidity'}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-white/70 dark:bg-[#12151c]/60">
                <Wind className="w-4 h-4 text-teal-500 mb-1" />
                <span className="text-[11px] text-gray-500">{lang === 'mr' ? 'वारा' : 'Wind'}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-white/70 dark:bg-[#12151c]/60">
                <CloudRain className="w-4 h-4 text-indigo-500 mb-1" />
                <span className="text-[11px] text-gray-500">{lang === 'mr' ? 'पाऊस शक्यता' : 'Rain Chance'}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{weather.precipitationProbability}%</span>
              </div>
            </div>

            {/* Right: Farming Action Tip */}
            <div className="flex flex-col justify-center bg-white/80 dark:bg-[#12151c]/80 p-3.5 rounded-xl border border-sky-100 dark:border-gray-800">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'कृषी सल्लागार' : 'Agri Weather Advisory'}</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {getFarmingTip(weather.temperature, weather.humidity, weather.precipitationProbability)}
              </p>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              {lang === 'mr' ? 'पुढील ५ दिवसांचा अंदाज' : '5-Day Weather Forecast'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {weather.daily.dates.map((dateStr, idx) => {
                const dateObj = new Date(dateStr);
                const dayName = dateObj.toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-US', { weekday: 'short' });
                const rain = weather.daily.rainProb[idx];
                const maxT = weather.daily.maxTemps[idx];
                const minT = weather.daily.minTemps[idx];

                return (
                  <div
                    key={dateStr}
                    className="p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/70 dark:bg-[#151921] flex flex-col items-center text-center hover:border-sky-300 transition"
                  >
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {idx === 0 ? (lang === 'mr' ? 'आज' : 'Today') : dayName}
                    </span>
                    <div className="my-2 text-sky-500">
                      {rain > 50 ? (
                        <CloudRain className="w-6 h-6 text-indigo-500" />
                      ) : (
                        <Sun className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {maxT}° / <span className="text-gray-500 font-normal">{minT}°</span>
                    </div>
                    <div className="text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-1 flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>{rain}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
