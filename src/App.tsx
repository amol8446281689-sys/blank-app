import { useState, useEffect } from 'react';
import {
  ExternalLink,
  Menu,
  X,
  Code2,
  Sparkles,
  BookOpen,
  RotateCw,
  Sliders,
  CheckCircle2,
  Share2,
  Sun,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FloatingBalloons } from './components/FloatingBalloons';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [balloonTrigger, setBalloonTrigger] = useState(1);
  const [sliderValue, setSliderValue] = useState(25);
  const [userName, setUserName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Data Analysis');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    step1: true,
    step2: false,
    step3: false,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Trigger balloons on first mount to give that welcoming Streamlit experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setBalloonTrigger((prev) => prev + 1);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const triggerBalloons = () => {
    setBalloonTrigger((prev) => prev + 1);
  };

  const triggerSnowOrConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4b4b', '#ff8c42', '#ffc43d', '#1dd1a1', '#00c0f2']
    });
  };

  const handleRerun = () => {
    setIsRunning(true);
    triggerBalloons();
    setTimeout(() => {
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#0e1117] text-[#fafafa]' : 'bg-white text-[#31333f]'
    }`}>
      {/* Streamlit Iconic Top Rainbow Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#ff4b4b] via-[#ff8c42] via-[#ffc43d] via-[#1dd1a1] to-[#00c0f2] z-50 sticky top-0" />

      {/* Floating Balloons Effect */}
      <FloatingBalloons triggerKey={balloonTrigger} />

      {/* Top Navigation Bar */}
      <header className={`h-12 border-b flex items-center justify-between px-4 sticky top-[3px] z-40 backdrop-blur-sm ${
        darkMode ? 'border-[#262730] bg-[#0e1117]/90' : 'border-[#e6eaf1] bg-white/95'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              sidebarOpen ? 'text-[#ff4b4b]' : 'text-gray-500'
            }`}
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-sm font-semibold tracking-tight text-gray-700 dark:text-gray-200">
            <span className="text-xl">🎈</span>
            <span>My new app</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 animate-pulse">
              <RotateCw className="w-3 h-3 animate-spin" />
              <span>Running...</span>
            </div>
          )}

          <button
            onClick={handleRerun}
            title="Re-run app (R)"
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            <RotateCw className="w-3 h-3" />
            <span className="hidden sm:inline">Rerun</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

          <a
            href="https://blank-app-template.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-[#ff4b4b] hover:bg-[#e03a3a] text-white text-xs font-medium rounded-md shadow-sm transition-colors"
          >
            <span>Deploy</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Streamlit Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64 sm:w-72 border-r' : 'w-0 border-transparent overflow-hidden'
          } transition-all duration-300 flex-shrink-0 flex flex-col justify-between ${
            darkMode ? 'bg-[#262730] border-[#31333f]' : 'bg-[#f0f2f6] border-[#e6eaf1]'
          }`}
        >
          {sidebarOpen && (
            <div className="p-4 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                  Navigation & Help
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Quick Links */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Streamlit Resources
                </h3>
                <nav className="flex flex-col space-y-1">
                  <a
                    href="https://docs.streamlit.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md bg-white/70 dark:bg-[#0e1117]/60 hover:bg-white dark:hover:bg-[#0e1117] transition text-gray-800 dark:text-gray-200 shadow-xs"
                  >
                    <span className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-[#ff4b4b]" />
                      <span>Documentation</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>

                  <a
                    href="https://docs.streamlit.io/develop/api-reference"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md bg-white/70 dark:bg-[#0e1117]/60 hover:bg-white dark:hover:bg-[#0e1117] transition text-gray-800 dark:text-gray-200 shadow-xs"
                  >
                    <span className="flex items-center space-x-2">
                      <Code2 className="w-4 h-4 text-[#00c0f2]" />
                      <span>API Reference</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>

                  <a
                    href="https://discuss.streamlit.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md bg-white/70 dark:bg-[#0e1117]/60 hover:bg-white dark:hover:bg-[#0e1117] transition text-gray-800 dark:text-gray-200 shadow-xs"
                  >
                    <span className="flex items-center space-x-2">
                      <Share2 className="w-4 h-4 text-[#ffc43d]" />
                      <span>Community Forum</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </nav>
              </div>

              {/* Getting Started Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Getting Started Checklist
                </h3>
                <div className="space-y-1.5 text-sm bg-white/70 dark:bg-[#0e1117]/60 p-3 rounded-lg shadow-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedItems.step1}
                      onChange={(e) => setCheckedItems({ ...checkedItems, step1: e.target.checked })}
                      className="rounded text-[#ff4b4b] focus:ring-[#ff4b4b]"
                    />
                    <span className={checkedItems.step1 ? 'line-through text-gray-400' : ''}>
                      Setup new blank app
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedItems.step2}
                      onChange={(e) => setCheckedItems({ ...checkedItems, step2: e.target.checked })}
                      className="rounded text-[#ff4b4b] focus:ring-[#ff4b4b]"
                    />
                    <span className={checkedItems.step2 ? 'line-through text-gray-400' : ''}>
                      Explore Streamlit docs
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedItems.step3}
                      onChange={(e) => setCheckedItems({ ...checkedItems, step3: e.target.checked })}
                      className="rounded text-[#ff4b4b] focus:ring-[#ff4b4b]"
                    />
                    <span className={checkedItems.step3 ? 'line-through text-gray-400' : ''}>
                      Build your first widget
                    </span>
                  </label>
                </div>
              </div>

              {/* Sidebar Action */}
              <div className="pt-2">
                <button
                  onClick={triggerBalloons}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm font-medium rounded-md bg-white dark:bg-[#0e1117] border border-gray-200 dark:border-gray-700 hover:border-[#ff4b4b] dark:hover:border-[#ff4b4b] text-gray-800 dark:text-gray-200 transition shadow-xs"
                >
                  <span>🎈</span>
                  <span>Release Balloons</span>
                </button>
              </div>
            </div>
          )}

          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>Streamlit React Port</span>
              <span>v0.1.0</span>
            </div>
          )}
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Primary Heading matching original streamlit_app.py: st.title("🎈 My new app") */}
            <div>
              <div className="inline-block group cursor-pointer" onClick={triggerBalloons}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
                  <span className="inline-block transform hover:scale-125 transition-transform duration-200 select-none">
                    🎈
                  </span>
                  <span>My new app</span>
                </h1>
              </div>

              {/* Primary Content matching original streamlit_app.py: st.write(...) */}
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Let's start building! For help and inspiration, head over to{' '}
                <a
                  href="https://docs.streamlit.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff4b4b] font-medium hover:underline inline-flex items-center gap-1"
                >
                  docs.streamlit.io
                  <ExternalLink className="w-3.5 h-3.5 inline" />
                </a>
                .
              </p>
            </div>

            {/* Interactive Celebration Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={triggerBalloons}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-[#ff4b4b] text-white hover:bg-[#e03a3a] active:scale-98 transition shadow-xs"
              >
                <span>🎈</span>
                <span>st.balloons()</span>
              </button>

              <button
                onClick={triggerSnowOrConfetti}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-white dark:bg-[#262730] border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>st.snow() / Confetti</span>
              </button>

              <button
                onClick={() => setShowCode(!showCode)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Code2 className="w-4 h-4" />
                <span>{showCode ? 'Hide Code' : 'View Source'}</span>
              </button>
            </div>

            {/* Original Python Code Inspector */}
            {showCode && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f232b] p-4 text-sm font-mono overflow-x-auto shadow-inner transition">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200 dark:border-gray-700 text-xs font-sans text-gray-500">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">streamlit_app.py</span>
                  <span>Original Source</span>
                </div>
                <pre className="text-gray-800 dark:text-gray-200">
{`import streamlit as st

st.title("🎈 My new app")
st.write(
    "Let's start building! For help and inspiration, head over to [docs.streamlit.io](https://docs.streamlit.io/)."
)`}
                </pre>
              </div>
            )}

            {/* Streamlit Interactive Playground Card */}
            <div className={`p-6 rounded-xl border ${
              darkMode ? 'bg-[#1e2129] border-[#2c303b]' : 'bg-gray-50/70 border-gray-200'
            } space-y-6 shadow-xs`}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-[#ff4b4b]" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Interactive Streamlit Widgets
                  </h2>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">
                  Live Preview
                </span>
              </div>

              {/* Slider widget: st.slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-medium text-gray-700 dark:text-gray-300">
                    st.slider("Select your experience level", 0, 100, {sliderValue})
                  </label>
                  <span className="font-mono text-sm px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                    {sliderValue}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full accent-[#ff4b4b] cursor-pointer"
                />
              </div>

              {/* Text Input widget: st.text_input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  st.text_input("What is your project name?")
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. My Amazing Data Dashboard"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-[#0e1117] border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff4b4b]/40 focus:border-[#ff4b4b]"
                  />
                  {userName && (
                    <button
                      onClick={() => setUserName('')}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {userName && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Project configured: "{userName}"</span>
                  </p>
                )}
              </div>

              {/* Selectbox widget: st.selectbox */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  st.selectbox("Choose a starter template", ...)
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-[#0e1117] border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff4b4b]/40 focus:border-[#ff4b4b]"
                >
                  <option value="Data Analysis">📊 Data Analysis & Visualizations</option>
                  <option value="Machine Learning">🤖 Machine Learning Model Dashboard</option>
                  <option value="Interactive Calculator">🧮 Interactive Financial Calculator</option>
                  <option value="Real-time Analytics">⚡ Real-time Analytics Tracker</option>
                </select>
              </div>

              {/* Widget output banner */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#0e1117] border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Selected template: <strong className="text-gray-900 dark:text-gray-200">{selectedTopic}</strong></span>
                <span className="font-mono">Ready to edit</span>
              </div>
            </div>

            {/* Bottom Streamlit footer info */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <span className="text-[#ff4b4b]">❤️</span>
                <span>using React & Streamlit style</span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://blank-app-template.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
                >
                  Original Streamlit App
                </a>
                <span>•</span>
                <a
                  href="https://github.com/amol8446281689-sys/blank-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
