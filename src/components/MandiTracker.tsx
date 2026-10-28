import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Sprout, ArrowUpRight, Calculator } from 'lucide-react';
import { INITIAL_CROPS } from '../data/maharashtraData';
import { CropPrice, Language } from '../types';

interface Props {
  lang: Language;
}

export function MandiTracker({ lang }: Props) {
  const [crops] = useState<CropPrice[]>(INITIAL_CROPS);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropPrice>(INITIAL_CROPS[0]);
  const [quantityQuintal, setQuantityQuintal] = useState<number>(10);

  const filteredCrops = crops.filter(c =>
    c.nameMr.toLowerCase().includes(search.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    c.topMarketMr.toLowerCase().includes(search.toLowerCase())
  );

  const estimatedIncome = quantityQuintal * selectedCrop.avgPrice;

  return (
    <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {lang === 'mr' ? 'कृषी उत्पन्न बाजारभाव (Mandi Rates)' : 'Mandi Rates & Crop Prices'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lang === 'mr' ? 'महाराष्ट्रातील प्रमुख बाजार समित्यांचे चालू बाजारभाव' : 'Current commodity prices across Maharashtra APMCs'}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={lang === 'mr' ? 'पीक किंवा बाजार शोधा...' : 'Search crop or mandi...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#252a35] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredCrops.map(crop => {
          const isSelected = selectedCrop.nameEn === crop.nameEn;
          return (
            <div
              key={crop.nameEn}
              onClick={() => setSelectedCrop(crop)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs'
                  : 'border-gray-200 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800/60 bg-gray-50/40 dark:bg-[#161a22]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {lang === 'mr' ? crop.nameMr : crop.nameEn}
                  </h3>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {crop.unit}
                  </span>
                </div>
                <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
                  crop.trend === 'up'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                    : crop.trend === 'down'
                    ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
                    : 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                }`}>
                  {crop.trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                  {crop.trend === 'down' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {crop.trend === 'stable' && <Minus className="w-3 h-3 mr-0.5" />}
                  <span>{crop.change > 0 ? `+${crop.change}%` : `${crop.change}%`}</span>
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">{lang === 'mr' ? 'सरासरी दर:' : 'Average:'}</span>
                  <span className="text-base font-black text-gray-900 dark:text-gray-100">
                    ₹{crop.avgPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  <span>{lang === 'mr' ? 'किमान' : 'Min'}: ₹{crop.minPrice}</span>
                  <span>{lang === 'mr' ? 'कमाल' : 'Max'}: ₹{crop.maxPrice}</span>
                </div>
              </div>

              <div className="mt-2.5 text-[10px] text-amber-700 dark:text-amber-400 font-medium truncate flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>{lang === 'mr' ? `बाजार: ${crop.topMarketMr}` : `APMC: ${crop.topMarketEn}`}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Yield & Income Calculator for Selected Crop */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-emerald-500/10 border border-amber-200 dark:border-amber-900/50 space-y-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            {lang === 'mr'
              ? `उत्पन्न कॅल्क्युलेटर: ${selectedCrop.nameMr}`
              : `Income Calculator for ${selectedCrop.nameEn}`}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'तुमचा शेतीमाल (क्विंटल / युनिट)' : 'Your Yield Quantity (Quintals)'}
            </label>
            <input
              type="number"
              min="1"
              value={quantityQuintal}
              onChange={(e) => setQuantityQuintal(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1e26] text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'अपेक्षित दर प्रति क्विंटल (₹)' : 'Expected Rate per Quintal (₹)'}
            </label>
            <div className="px-3 py-1.5 text-sm font-bold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              ₹ {selectedCrop.avgPrice.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-[#12151c] border border-amber-200 dark:border-amber-900 text-center sm:text-right">
            <span className="text-[11px] text-gray-500 block">
              {lang === 'mr' ? 'एकूण अंदाजे विक्री उत्पन्न' : 'Total Estimated Gross Income'}
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ₹ {Math.round(estimatedIncome).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
