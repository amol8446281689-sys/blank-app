import { useState } from 'react';
import {
  Sun,
  Moon,
  CloudRain,
  Wallet,
  Calculator,
  CheckSquare,
  Sparkles,
  Languages,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FloatingBalloons } from './components/FloatingBalloons';
import { WeatherWidget } from './components/WeatherWidget';
import { LandCalculator } from './components/LandCalculator';
import { MandiTracker } from './components/MandiTracker';
import { KhataBook } from './components/KhataBook';
import { InterestCalculator } from './components/InterestCalculator';
import { TodoNotes } from './components/TodoNotes';
import { Language } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('mr');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'agri' | 'khata' | 'calc' | 'tasks'>('agri');
  const [balloonTrigger, setBalloonTrigger] = useState<number>(0);

  const triggerBalloons = () => {
    setBalloonTrigger(prev => prev + 1);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#ff4b4b', '#ff9f43', '#10b981', '#06b6d4', '#8b5cf6']
    });
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'mr' ? 'en' : 'mr'));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#0e1117] text-[#f1f3f7]' : 'bg-[#f8fafc] text-[#1e293b]'
    }`}>
      {/* Top Rainbow Aesthetic Stripe */}
      <div className="h-[3.5px] w-full bg-gradient-to-r from-[#ff4b4b] via-[#f59e0b] via-[#10b981] via-[#06b6d4] to-[#8b5cf6] sticky top-0 z-50 shadow-xs" />

      {/* Floating Balloons Effect */}
      <FloatingBalloons triggerKey={balloonTrigger} />

      {/* Header Bar */}
      <header className={`sticky top-[3.5px] z-40 backdrop-blur-md border-b transition-colors px-4 sm:px-8 py-3 flex items-center justify-between ${
        darkMode ? 'bg-[#0e1117]/90 border-[#222734]' : 'bg-white/90 border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={triggerBalloons}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-md hover:scale-105 active:scale-95 transition select-none cursor-pointer"
            title={lang === 'mr' ? 'फुगे उडवा 🎈' : 'Release Balloons 🎈'}
          >
            🌾
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <span>{lang === 'mr' ? 'सह्याद्री स्मार्ट हब' : 'Sahyadri Smart Hub'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold">
                  v2.0
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              {lang === 'mr' ? 'शेतकरी, व्यापारी व दैनिक जीवन सहाय्यक' : 'Smart daily assistant for farming, finance & utilities'}
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1e26] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition"
            title="Switch Language / भाषा बदला"
          >
            <Languages className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'mr' ? 'English' : 'मराठी'}</span>
          </button>

          {/* Balloon Celebration Button */}
          <button
            onClick={triggerBalloons}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1e26] hover:bg-slate-50 dark:hover:bg-slate-800 text-sm shadow-xs transition"
            title={lang === 'mr' ? 'फुगे उडवा' : 'Fly Balloons'}
          >
            🎈
          </button>

          {/* Confetti Trigger */}
          <button
            onClick={triggerCelebration}
            className="hidden sm:flex p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1e26] hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-500 shadow-xs transition"
            title="Celebrate"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1e26] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-xs transition"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Navigation Sub-Bar / Primary Tabs */}
      <div className={`sticky top-[59px] z-30 border-b transition-colors px-4 sm:px-8 py-2.5 backdrop-blur-md ${
        darkMode ? 'bg-[#12151c]/95 border-[#222734]' : 'bg-slate-50/95 border-slate-200/90'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('agri')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'agri'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span>{lang === 'mr' ? '🌾 हवामान व शेती' : 'Agri & Weather'}</span>
          </button>

          <button
            onClick={() => setActiveTab('khata')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'khata'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{lang === 'mr' ? '💰 हिशोब व खातावही' : 'Finance & Khata'}</span>
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'calc'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{lang === 'mr' ? '📐 जमीन व व्याज कॅल्क्युलेटर' : 'Land & Loan Calc'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{lang === 'mr' ? '📝 कामे, नोट्स व दिनदर्शिका' : 'Tasks & Notes'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Tab 1: Agri & Weather */}
        {activeTab === 'agri' && (
          <div className="space-y-6">
            <WeatherWidget lang={lang} />
            <MandiTracker lang={lang} />
          </div>
        )}

        {/* Tab 2: Finance & Khata */}
        {activeTab === 'khata' && (
          <div className="space-y-6">
            <KhataBook lang={lang} />
          </div>
        )}

        {/* Tab 3: Land & Loan Calculators */}
        {activeTab === 'calc' && (
          <div className="space-y-6">
            <LandCalculator lang={lang} />
            <InterestCalculator lang={lang} />
          </div>
        )}

        {/* Tab 4: Tasks, Voice Notes & Festivals */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <TodoNotes lang={lang} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 px-4 sm:px-8 mt-auto text-xs transition-colors ${
        darkMode ? 'border-[#222734] bg-[#0c0e14] text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5">
            <span>{lang === 'mr' ? 'सह्याद्री स्मार्ट हब' : 'Sahyadri Smart Hub'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>{lang === 'mr' ? 'महाराष्ट्रासाठी प्रेमाने बनवलेले' : 'Crafted with'}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={triggerBalloons}
              className="hover:text-amber-500 transition flex items-center gap-1 font-semibold"
            >
              <span>🎈</span>
              <span>{lang === 'mr' ? 'फुगे उडवा' : 'st.balloons()'}</span>
            </button>
            <span>•</span>
            <span>{lang === 'mr' ? 'अचूक आणि सुरक्षित' : 'Fast & Offline Ready'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
