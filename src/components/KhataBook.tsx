import { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Trash2,
  Users,
  MessageCircle,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Language, Transaction, KhataContact } from '../types';

interface Props {
  lang: Language;
}

export function KhataBook({ lang }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'khata'>('transactions');

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sahyadri_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: '1',
        type: 'income',
        amount: 35000,
        category: 'शेती उत्पन्न (Agri Sales)',
        description: 'कांदा विक्री लासलगाव बाजार',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        type: 'expense',
        amount: 4500,
        category: 'खते व बियाणे (Fertilizers)',
        description: 'खत व कीटकनाशक खरेदी',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        type: 'expense',
        amount: 2200,
        category: 'डिझेल / इंधन (Fuel)',
        description: 'ट्रॅक्टर डिझेल',
        date: new Date().toISOString().split('T')[0]
      }
    ];
  });

  // Khata Contacts State
  const [contacts, setContacts] = useState<KhataContact[]>(() => {
    const saved = localStorage.getItem('sahyadri_khata_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: '1',
        name: 'रमेश पाटील (व्यापारी)',
        phone: '9876543210',
        balance: 12500, // They owe you
        lastUpdated: new Date().toLocaleDateString(),
        history: [
          {
            id: 'h1',
            type: 'given',
            amount: 12500,
            note: 'भाजीपाला माल उधारी',
            date: new Date().toLocaleDateString()
          }
        ]
      },
      {
        id: '2',
        name: 'कृषी सेवा केंद्र (दुकान)',
        phone: '9822011223',
        balance: -3000, // You owe them
        lastUpdated: new Date().toLocaleDateString(),
        history: [
          {
            id: 'h2',
            type: 'received',
            amount: 3000,
            note: 'औषध खरेदी बाकी',
            date: new Date().toLocaleDateString()
          }
        ]
      }
    ];
  });

  // Transaction form
  const [tType, setTType] = useState<'income' | 'expense'>('income');
  const [tAmount, setTAmount] = useState<string>('');
  const [tCategory, setTCategory] = useState<string>('शेती उत्पन्न');
  const [tDesc, setTDesc] = useState<string>('');

  // New Contact form
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactBalance, setNewContactBalance] = useState<string>('');
  const [newContactBalanceType, setNewContactBalanceType] = useState<'theyOwe' | 'iOwe'>('theyOwe');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sahyadri_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sahyadri_khata_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(tAmount);
    if (!amountNum || amountNum <= 0) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: tType,
      amount: amountNum,
      category: tCategory,
      description: tDesc.trim() || (tType === 'income' ? 'जमा' : 'खर्च'),
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTx, ...transactions]);
    setTAmount('');
    setTDesc('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    const balanceNum = parseFloat(newContactBalance) || 0;
    const finalBalance = newContactBalanceType === 'theyOwe' ? balanceNum : -balanceNum;

    const newC: KhataContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      balance: finalBalance,
      lastUpdated: new Date().toLocaleDateString(),
      history: balanceNum > 0 ? [
        {
          id: Date.now().toString(),
          type: newContactBalanceType === 'theyOwe' ? 'given' : 'received',
          amount: balanceNum,
          note: 'सुरुवातीची बाकी (Initial Balance)',
          date: new Date().toLocaleDateString()
        }
      ] : []
    };

    setContacts([...contacts, newC]);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactBalance('');
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  // Metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalReceivable = contacts
    .filter(c => c.balance > 0)
    .reduce((sum, c) => sum + c.balance, 0);

  const totalPayable = contacts
    .filter(c => c.balance < 0)
    .reduce((sum, c) => sum + Math.abs(c.balance), 0);

  const sendWhatsAppReminder = (contact: KhataContact) => {
    const text = lang === 'mr'
      ? `नमस्कार ${contact.name} जी, आपल्या खात्याची बाकी रक्कम ₹${contact.balance.toLocaleString('en-IN')} आहे. कृपया खात्री करावी. धन्यवाद!`
      : `Hello ${contact.name}, this is a gentle reminder that outstanding balance is ₹${contact.balance.toLocaleString('en-IN')}. Thank you!`;
    const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 transition-all space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {lang === 'mr' ? 'दैनिक हिशोब व डिजिटल खातावही' : 'Daily Finance & Digital Khata'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lang === 'mr' ? 'जमा-खर्च आणि उधारी-देणी यांची नोंद' : 'Income, expense, and customer credit ledger'}
            </p>
          </div>
        </div>

        {/* Sub tab navigation */}
        <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'transactions'
                ? 'bg-white dark:bg-[#252a35] text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-violet-500" />
            <span>{lang === 'mr' ? 'जमा-खर्च वही' : 'Income & Expense'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('khata')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'khata'
                ? 'bg-white dark:bg-[#252a35] text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-violet-500" />
            <span>{lang === 'mr' ? 'उधार-जमा वही (Khata)' : 'Customer Khata'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {activeSubTab === 'transactions' ? (
          <>
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'एकूण जमा (Income)' : 'Total Income'}</span>
              </span>
              <div className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
                ₹ {totalIncome.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20">
              <span className="text-xs font-medium text-rose-700 dark:text-rose-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'एकूण खर्च (Expense)' : 'Total Expense'}</span>
              </span>
              <div className="text-xl font-black text-rose-800 dark:text-rose-300 mt-1">
                ₹ {totalExpense.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50/40 dark:bg-violet-950/20">
              <span className="text-xs font-medium text-violet-700 dark:text-violet-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'शिल्लक (Net Balance)' : 'Net Balance'}</span>
              </span>
              <div className={`text-xl font-black mt-1 ${
                netBalance >= 0 ? 'text-violet-900 dark:text-violet-300' : 'text-rose-600'
              }`}>
                ₹ {netBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {lang === 'mr' ? 'बाजारकडून येणे बाकी (Receivable)' : 'You Will Get'}
              </span>
              <div className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
                ₹ {totalReceivable.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20">
              <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
                {lang === 'mr' ? 'आपण देणे बाकी (Payable)' : 'You Will Give'}
              </span>
              <div className="text-xl font-black text-rose-800 dark:text-rose-300 mt-1">
                ₹ {totalPayable.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                {lang === 'mr' ? 'नोंदणीकृत ग्राहक/व्यक्ती' : 'Registered Contacts'}
              </span>
              <div className="text-xl font-black text-blue-800 dark:text-blue-300 mt-1">
                {contacts.length} {lang === 'mr' ? 'खाती' : 'Accounts'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'transactions' ? (
        <div className="space-y-6">
          {/* Add Transaction Form */}
          <form onSubmit={addTransaction} className="p-4 rounded-xl bg-gray-50/70 dark:bg-[#161a22] border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {lang === 'mr' ? '+ नवीन नोंद करा (Add Entry)' : '+ Add New Transaction'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'प्रकार (Type)' : 'Type'}
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setTType('income')}
                    className={`flex-1 py-1.5 text-xs font-bold transition ${
                      tType === 'income'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-[#1f232b] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang === 'mr' ? 'जमा (Income)' : 'Income'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTType('expense')}
                    className={`flex-1 py-1.5 text-xs font-bold transition ${
                      tType === 'expense'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-[#1f232b] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang === 'mr' ? 'खर्च (Expense)' : 'Expense'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'रक्कम (₹ Amount)' : 'Amount (₹)'}
                </label>
                <input
                  type="number"
                  placeholder="उदा. 5000"
                  value={tAmount}
                  onChange={(e) => setTAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'वर्ग (Category)' : 'Category'}
                </label>
                <select
                  value={tCategory}
                  onChange={(e) => setTCategory(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
                >
                  <option value="शेती उत्पन्न">🌾 शेती उत्पन्न (Agri Produce)</option>
                  <option value="खते व बियाणे">🌱 खते व बियाणे (Seeds/Fertilizer)</option>
                  <option value="मजुरी / कामगार">👷 मजुरी (Labor Charges)</option>
                  <option value="डिझेल / इंधन">⛽ डिझेल व वाहतूक (Fuel/Transport)</option>
                  <option value="किराणा व घरखर्च">🛒 किराणा व घरखर्च (Household)</option>
                  <option value="व्यवसाय विक्री">💼 व्यवसाय विक्री (Business Sale)</option>
                  <option value="इतर">📦 इतर (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'तपशील (Note)' : 'Description'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="उदा. खत खरेदी किंवा माल विक्री"
                    value={tDesc}
                    onChange={(e) => setTDesc(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'mr' ? 'जोडा' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Transaction List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {lang === 'mr' ? 'नोंदींचा इतिहास (Recent Transactions)' : 'Recent History'}
            </h3>

            {transactions.length === 0 ? (
              <p className="text-center py-8 text-sm text-gray-400">
                {lang === 'mr' ? 'अद्याप कोणत्याही नोंदी नाहीत' : 'No transactions recorded yet'}
              </p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {transactions.map(t => (
                  <div
                    key={t.id}
                    className="p-3 bg-white dark:bg-[#1a1e26] hover:bg-gray-50 dark:hover:bg-[#1f232b] flex items-center justify-between transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        t.type === 'income'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                      }`}>
                        {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                          {t.description}
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2">
                          <span>{t.category}</span>
                          <span>•</span>
                          <span>{t.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-black ${
                        t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-gray-400 hover:text-rose-500 transition p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Khata Contacts Section */
        <div className="space-y-6">
          {/* Add Contact Form */}
          <form onSubmit={addContact} className="p-4 rounded-xl bg-gray-50/70 dark:bg-[#161a22] border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {lang === 'mr' ? '+ नवीन खातेदार जोडा (Add New Customer/Account)' : '+ Add Customer Account'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'नाव (Customer Name)' : 'Name'}
                </label>
                <input
                  type="text"
                  placeholder="उदा. ज्ञानेश्वर कदम"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'मोबाईल नंबर (WhatsApp)' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  placeholder="उदा. 9876543210"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'सुरुवातीची बाकी (₹)' : 'Starting Balance (₹)'}
                </label>
                <input
                  type="number"
                  placeholder="उदा. 2000"
                  value={newContactBalance}
                  onChange={(e) => setNewContactBalance(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'mr' ? 'बाकी स्थिती (Status)' : 'Balance Status'}
                </label>
                <div className="flex gap-2">
                  <select
                    value={newContactBalanceType}
                    onChange={(e) => setNewContactBalanceType(e.target.value as 'theyOwe' | 'iOwe')}
                    className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1f232b] text-gray-900 dark:text-gray-100"
                  >
                    <option value="theyOwe">{lang === 'mr' ? 'त्यांच्याकडून येणे आहे' : 'They Owe (Receivable)'}</option>
                    <option value="iOwe">{lang === 'mr' ? 'आपण देणे आहे' : 'You Owe (Payable)'}</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'mr' ? 'जतन करा' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Contacts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {contacts.map(c => {
              const isReceivable = c.balance >= 0;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161a22] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{c.name}</h4>
                      {c.phone && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{c.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-black ${
                        isReceivable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        ₹ {Math.abs(c.balance).toLocaleString('en-IN')}
                      </span>
                      <span className={`block text-[10px] font-semibold ${
                        isReceivable ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                      }`}>
                        {isReceivable
                          ? (lang === 'mr' ? 'येणे बाकी (Receivable)' : 'To Receive')
                          : (lang === 'mr' ? 'देणे बाकी (Payable)' : 'To Pay')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                    <button
                      onClick={() => sendWhatsAppReminder(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold hover:bg-emerald-100 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'mr' ? 'WhatsApp मेसेज' : 'WhatsApp'}</span>
                    </button>

                    <button
                      onClick={() => deleteContact(c.id)}
                      className="text-gray-400 hover:text-rose-500 transition text-[11px] flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'mr' ? 'खाते हटवा' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
