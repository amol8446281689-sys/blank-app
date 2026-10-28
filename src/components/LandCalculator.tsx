import { useState } from 'react';
import { Calculator, Maximize2, Compass, Layers } from 'lucide-react';
import { LAND_UNITS } from '../data/maharashtraData';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export function LandCalculator({ lang }: Props) {
  // Mode: direct conversion or dimension-based (Length x Width)
  const [mode, setMode] = useState<'convert' | 'dimensions'>('convert');

  // Direct conversion states
  const [inputVal, setInputVal] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('guntha');

  // Dimension based states (Feet)
  const [lengthFeet, setLengthFeet] = useState<number>(33);
  const [widthFeet, setWidthFeet] = useState<number>(33);

  // Valuation
  const [ratePerUnit, setRatePerUnit] = useState<number>(50000);
  const [valuationUnit, setValuationUnit] = useState<string>('guntha');

  // Calculate Sq Ft from direct input
  const currentUnitObj = LAND_UNITS.find(u => u.id === selectedUnit) || LAND_UNITS[0];
  const totalSqFt = mode === 'convert'
    ? inputVal * currentUnitObj.toSqFt
    : lengthFeet * widthFeet;

  // Compute all conversions from totalSqFt
  const getConvertedValues = () => {
    return LAND_UNITS.map(unit => ({
      ...unit,
      value: (totalSqFt / unit.toSqFt)
    }));
  };

  const convertedList = getConvertedValues();

  // Valuation calculation
  const valuationUnitObj = LAND_UNITS.find(u => u.id === valuationUnit) || LAND_UNITS[0];
  const unitsInSelectedValuation = totalSqFt / valuationUnitObj.toSqFt;
  const totalCost = unitsInSelectedValuation * ratePerUnit;

  return (
    <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 transition-all space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {lang === 'mr' ? 'जमीन मोजणी व क्षेत्रफळ कॅल्क्युलेटर' : 'Land Area & Plot Calculator'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lang === 'mr' ? 'गुंठा, एकर, हेक्टर, बिघा, चौरस फूट अचूक रुपांतर' : 'Instant conversion for Guntha, Acre, Hectare, Sq Ft'}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setMode('convert')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              mode === 'convert'
                ? 'bg-white dark:bg-[#252a35] text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            {lang === 'mr' ? 'एकक रुपांतर (Converter)' : 'Unit Converter'}
          </button>
          <button
            onClick={() => setMode('dimensions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              mode === 'dimensions'
                ? 'bg-white dark:bg-[#252a35] text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            {lang === 'mr' ? 'लांबी × रुंदी (Dimensions)' : 'Length × Width'}
          </button>
        </div>
      </div>

      {/* Input Section */}
      {mode === 'convert' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'क्षेत्रफळ संख्या प्रविष्ट करा' : 'Enter Land Area'}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={inputVal}
              onChange={(e) => setInputVal(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 text-base font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e232d] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'मूळ एकक निवडा' : 'Select Source Unit'}
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e232d] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {LAND_UNITS.map(u => (
                <option key={u.id} value={u.id}>
                  {lang === 'mr' ? u.nameMr : u.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'लांबी (फूट / Feet)' : 'Length (Feet)'}
            </label>
            <input
              type="number"
              min="1"
              value={lengthFeet}
              onChange={(e) => setLengthFeet(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 text-base font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e232d] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'रुंदी (फूट / Feet)' : 'Width (Feet)'}
            </label>
            <input
              type="number"
              min="1"
              value={widthFeet}
              onChange={(e) => setWidthFeet(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 text-base font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e232d] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Real-time Visual Conversion Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {lang === 'mr' ? 'रुपांतरित मूल्ये (इतर सर्व एककांमध्ये)' : 'Converted Area Values in All Units'}
          </h3>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            १ गुंठा = ३३ × ३३ फूट = १०८९ चौ. फूट
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {convertedList.map(item => {
            const isHighlight = item.id === 'guntha' || item.id === 'acre';
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isHighlight
                    ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/30'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#171b22]'
                }`}
              >
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block truncate">
                  {lang === 'mr' ? item.nameMr : item.nameEn}
                </span>
                <div className="text-lg font-black text-gray-900 dark:text-gray-100 mt-1">
                  {item.value < 0.001 && item.value > 0
                    ? item.value.toFixed(6)
                    : item.value.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Plot Simulator */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#151820] border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'mr' ? 'प्लॉटचे दृश्य (Plot Visualizer)' : 'Plot Diagram Preview'}</span>
          </span>
          <span className="text-xs text-gray-500">
            {lang === 'mr' ? `एकूण: ${totalSqFt.toLocaleString()} चौ. फूट` : `Total: ${totalSqFt.toLocaleString()} Sq. Ft`}
          </span>
        </div>

        <div className="h-32 w-full rounded-lg border-2 border-dashed border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/5 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <Compass className="w-3 h-3" />
            <span>N</span>
          </div>
          <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
            {convertedList.find(c => c.id === 'acre')?.value.toFixed(3)} {lang === 'mr' ? 'एकर' : 'Acres'} / {convertedList.find(c => c.id === 'guntha')?.value.toFixed(2)} {lang === 'mr' ? 'गुंठे' : 'Gunthas'}
          </div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
            {mode === 'dimensions'
              ? `${lengthFeet} ft × ${widthFeet} ft`
              : `${Math.round(Math.sqrt(totalSqFt))} ft × ${Math.round(Math.sqrt(totalSqFt))} ft (अंदाजे बाजू)`}
          </div>
        </div>
      </div>

      {/* Land Valuation Estimator */}
      <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{lang === 'mr' ? 'जमिनीची अंदाजे किंमत / मूल्य' : 'Land Price & Valuation Estimator'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'बाजारभाव दर (₹)' : 'Rate per unit (₹)'}
            </label>
            <input
              type="number"
              min="0"
              value={ratePerUnit}
              onChange={(e) => setRatePerUnit(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e232d] text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {lang === 'mr' ? 'दर कशाप्रमाणे आहे?' : 'Rate is per what?'}
            </label>
            <select
              value={valuationUnit}
              onChange={(e) => setValuationUnit(e.target.value)}
              className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e232d] text-gray-900 dark:text-gray-100"
            >
              <option value="guntha">{lang === 'mr' ? 'प्रति गुंठा' : 'Per Guntha'}</option>
              <option value="acre">{lang === 'mr' ? 'प्रति एकर' : 'Per Acre'}</option>
              <option value="sqft">{lang === 'mr' ? 'प्रति चौ. फूट' : 'Per Sq. Feet'}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-amber-200 dark:border-amber-900/40">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {lang === 'mr' ? 'एकूण अंदाजे किंमत:' : 'Estimated Total Value:'}
          </span>
          <span className="text-lg font-black text-amber-900 dark:text-amber-200">
            ₹ {Math.round(totalCost).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
