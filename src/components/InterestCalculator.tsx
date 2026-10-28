import { useState } from 'react';
import { Percent, Building2, Coins } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export function InterestCalculator({ lang }: Props) {
  const [calcType, setCalcType] = useState<'bank' | 'rural'>('rural');

  // Bank Loan EMI States
  const [principal, setPrincipal] = useState<number>(500000);
  const [annualRate, setAnnualRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // Rural / Market Interest States (उदा. २ रुपये शेकडा दरमहा)
  const [ruralPrincipal, setRuralPrincipal] = useState<number>(100000);
  const [monthlyRatePercent, setMonthlyRatePercent] = useState<number>(2.0); // 2% per month (२ रुपये शेकडा)
  const [tenureMonths, setTenureMonths] = useState<number>(12);

  // Bank EMI calculation
  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const emi = monthlyRate === 0
    ? principal / totalMonths
    : (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalBankPayment = emi * totalMonths;
  const totalBankInterest = totalBankPayment - principal;

  // Rural Simple Monthly Interest
  const monthlyInterestAmount = (ruralPrincipal * monthlyRatePercent) / 100;
  const totalRuralInterest = monthlyInterestAmount * tenureMonths;
  const totalRuralPayable = ruralPrincipal + totalRuralInterest;

  return (
    <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {lang === 'mr' ? 'कर्ज ईएमआय व व्याज कॅल्क्युलेटर' : 'Loan EMI & Interest Calculator'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lang === 'mr' ? 'बँक ईएमआय आणि स्थानिक शेकडा दरमहा व्याज' : 'Bank EMI and local monthly interest rates'}
            </p>
          </div>
        </div>

        {/* Mode Switch */}
        <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            onClick={() => setCalcType('rural')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              calcType === 'rural'
                ? 'bg-white dark:bg-[#252a35] text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-orange-500" />
            <span>{lang === 'mr' ? 'शेकडा व्याज (दरमहा)' : 'Monthly % Rate'}</span>
          </button>
          <button
            onClick={() => setCalcType('bank')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              calcType === 'bank'
                ? 'bg-white dark:bg-[#252a35] text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-orange-500" />
            <span>{lang === 'mr' ? 'बँक कर्ज ईएमआय' : 'Bank Loan EMI'}</span>
          </button>
        </div>
      </div>

      {calcType === 'rural' ? (
        /* Rural / Monthly Simple Interest Calculation */
        <div className="space-y-6">
          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            💡 {lang === 'mr'
              ? 'स्थानिक बाजार किंवा गावातील हिशोबासाठी: उदा. २ रुपये शेकडा म्हणजे दरमहा २% व्याज.'
              : 'Common local practice: e.g., ₹2 shekda means 2% interest per month on principal.'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'mr' ? 'मुद्दल रक्कम (Principal ₹)' : 'Principal Amount (₹)'}
              </label>
              <input
                type="number"
                min="100"
                value={ruralPrincipal}
                onChange={(e) => setRuralPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'mr' ? 'व्याज दर (दरमहा % / शेकडा)' : 'Monthly Interest Rate (%)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={monthlyRatePercent}
                onChange={(e) => setMonthlyRatePercent(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'mr' ? 'कालावधी (महिने / Months)' : 'Duration (Months)'}
              </label>
              <input
                type="number"
                min="1"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#171b22]">
              <span className="text-xs font-medium text-gray-500">
                {lang === 'mr' ? 'दरमहा व्याज (Monthly Interest)' : 'Monthly Interest'}
              </span>
              <div className="text-lg font-black text-orange-600 dark:text-orange-400 mt-1">
                ₹ {Math.round(monthlyInterestAmount).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#171b22]">
              <span className="text-xs font-medium text-gray-500">
                {lang === 'mr' ? `एकूण व्याज (${tenureMonths} महिने)` : `Total Interest (${tenureMonths}m)`}
              </span>
              <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-1">
                ₹ {Math.round(totalRuralInterest).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/20">
              <span className="text-xs font-medium text-orange-800 dark:text-orange-300">
                {lang === 'mr' ? 'एकूण परतफेड रक्कम' : 'Total Payable Amount'}
              </span>
              <div className="text-xl font-black text-orange-900 dark:text-orange-200 mt-1">
                ₹ {Math.round(totalRuralPayable).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Bank Loan EMI Calculation */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'mr' ? 'कर्ज रक्कम (Loan Amount ₹)' : 'Loan Amount (₹)'}
              </label>
              <input
                type="number"
                min="1000"
                value={principal}
                onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'mr' ? 'वार्षिक व्याज दर (% प्रति वर्ष)' : 'Annual Interest Rate (%)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'mr' ? 'कालावधी (वर्षे / Years)' : 'Tenure (Years)'}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/20">
              <span className="text-xs font-medium text-orange-800 dark:text-orange-300">
                {lang === 'mr' ? 'मासिक हप्ता (Monthly EMI)' : 'Monthly EMI'}
              </span>
              <div className="text-xl font-black text-orange-900 dark:text-orange-200 mt-1">
                ₹ {Math.round(emi).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#171b22]">
              <span className="text-xs font-medium text-gray-500">
                {lang === 'mr' ? 'एकूण व्याज रक्कम (Total Interest)' : 'Total Interest'}
              </span>
              <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-1">
                ₹ {Math.round(totalBankInterest).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#171b22]">
              <span className="text-xs font-medium text-gray-500">
                {lang === 'mr' ? 'एकूण परतफेड (Principal + Interest)' : 'Total Payment'}
              </span>
              <div className="text-lg font-black text-gray-900 dark:text-gray-100 mt-1">
                ₹ {Math.round(totalBankPayment).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
