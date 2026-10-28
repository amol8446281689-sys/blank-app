import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Mic,
  MicOff,
  Copy,
  Calendar,
  Sparkles,
  Check,
  FileText
} from 'lucide-react';
import { FESTIVALS_MARATHI } from '../data/maharashtraData';
import { Language, TaskItem, NoteItem } from '../types';

interface Props {
  lang: Language;
}

export function TodoNotes({ lang }: Props) {
  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('sahyadri_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: '1',
        text: 'कांदा पिकाला ठिबक सिंचनाने पाणी देणे',
        completed: false,
        category: 'farming',
        priority: 'high'
      },
      {
        id: '2',
        text: 'बाजार समितीमध्ये जाऊन सोयाबीन दर तपासणे',
        completed: true,
        category: 'farming',
        priority: 'medium'
      },
      {
        id: '3',
        text: 'लाइट बिल आणि सोसायटी कर्ज हप्ता भरणे',
        completed: false,
        category: 'finance',
        priority: 'high'
      }
    ];
  });

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('sahyadri_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: '1',
        title: 'कांदा लागवड नियोजन',
        content: 'उन्हाळी कांदा रोपांची पुनर्लागवड डिसेंबर अखेर पूर्ण करणे. एकरी २५ क्विंटल चांगले कुजलेले शेणखत देणे.',
        date: new Date().toLocaleDateString(),
        pinned: true
      }
    ];
  });

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'farming' | 'finance' | 'personal' | 'work'>('farming');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sahyadri_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sahyadri_notes', JSON.stringify(notes));
  }, [notes]);

  // Voice recording using Web Speech API
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(lang === 'mr' ? 'आपल्या ब्राउझरमध्ये व्हॉईस टायपिंग उपलब्ध नाही.' : 'Speech recognition not supported in this browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewNoteContent(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const t: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      category: newTaskCategory,
      priority: newTaskPriority
    };

    setTasks([t, ...tasks]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() && !newNoteTitle.trim()) return;

    const n: NoteItem = {
      id: Date.now().toString(),
      title: newNoteTitle.trim() || (lang === 'mr' ? 'नोंद' : 'Note'),
      content: newNoteContent.trim(),
      date: new Date().toLocaleDateString(),
      pinned: false
    };

    setNotes([n, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const copyNote = (note: NoteItem) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column: Left Tasks, Right Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Card */}
        <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {lang === 'mr' ? 'दैनंदिन कार्य सूची (To-Do List)' : 'Daily Tasks Checklist'}
                </h2>
                <p className="text-[11px] text-gray-500">
                  {tasks.filter(t => !t.completed).length} {lang === 'mr' ? 'कामे बाकी' : 'pending tasks'}
                </p>
              </div>
            </div>
          </div>

          {/* Add Task Input */}
          <form onSubmit={addTask} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'mr' ? 'नवीन काम लिहा (उदा. फवारणी, बाजार, हिशोब)...' : 'Write new task...'}
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#252a35] text-gray-900 dark:text-gray-100"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'जोडा' : 'Add'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1e26] text-gray-700 dark:text-gray-300"
              >
                <option value="farming">{lang === 'mr' ? '🌾 शेती (Farming)' : 'Farming'}</option>
                <option value="finance">{lang === 'mr' ? '💰 वित्त (Finance)' : 'Finance'}</option>
                <option value="work">{lang === 'mr' ? '💼 व्यवसाय (Work)' : 'Work'}</option>
                <option value="personal">{lang === 'mr' ? '🏠 वैयक्तिक (Personal)' : 'Personal'}</option>
              </select>

              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1e26] text-gray-700 dark:text-gray-300"
              >
                <option value="high">{lang === 'mr' ? '🔴 तातडीचे (Urgent)' : 'High Priority'}</option>
                <option value="medium">{lang === 'mr' ? '🟡 मध्यम (Normal)' : 'Normal'}</option>
                <option value="low">{lang === 'mr' ? '🟢 नंतर (Low)' : 'Low'}</option>
              </select>
            </div>
          </form>

          {/* Task List */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-center py-6 text-xs text-gray-400">
                {lang === 'mr' ? 'कोणतीही प्रलंबित कामे नाहीत.' : 'No tasks created yet.'}
              </p>
            ) : (
              tasks.map(t => (
                <div
                  key={t.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                    t.completed
                      ? 'bg-gray-50/50 dark:bg-[#151820] border-gray-200 dark:border-gray-800 text-gray-400 opacity-70'
                      : 'bg-white dark:bg-[#1e232d] border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-xs'
                  }`}
                >
                  <div
                    onClick={() => toggleTask(t.id)}
                    className="flex items-center space-x-2.5 flex-1 cursor-pointer select-none"
                  >
                    {t.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={t.completed ? 'line-through' : 'font-medium'}>
                      {t.text}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 ml-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      t.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60' :
                      t.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60'
                    }`}>
                      {t.priority}
                    </span>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="text-gray-400 hover:text-rose-500 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Smart Notes with Voice Dictation */}
        <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {lang === 'mr' ? 'स्मार्ट व्हॉईस नोट्स (Voice Notes)' : 'Quick Voice & Text Notes'}
                </h2>
                <p className="text-[11px] text-gray-500">
                  {lang === 'mr' ? 'बोलून किंवा टाईप करून झटपट नोंद करा' : 'Dictate in Marathi/English or type'}
                </p>
              </div>
            </div>

            {/* Voice Dictation Button */}
            <button
              onClick={toggleSpeechRecognition}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? (lang === 'mr' ? 'ऐकत आहे...' : 'Listening...') : (lang === 'mr' ? 'माईक' : 'Voice Mic')}</span>
            </button>
          </div>

          {/* Add Note Form */}
          <form onSubmit={addNote} className="space-y-2">
            <input
              type="text"
              placeholder={lang === 'mr' ? 'नोंदीचे शीर्षक (Title)...' : 'Note Title...'}
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#252a35] text-gray-900 dark:text-gray-100"
            />
            <textarea
              rows={2}
              placeholder={lang === 'mr' ? 'तपशील लिहा किंवा माईक दाबून बोला...' : 'Type note content or click mic to speak...'}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#252a35] text-gray-900 dark:text-gray-100 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'नोंद साठवा' : 'Save Note'}</span>
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {notes.map(n => (
              <div
                key={n.id}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-[#161a22] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">{n.title}</h4>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => copyNote(n)}
                      className="p-1 text-gray-400 hover:text-purple-600 transition"
                      title="Copy"
                    >
                      {copiedId === n.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal whitespace-pre-wrap">
                  {n.content}
                </p>
                <span className="text-[10px] text-gray-400 block pt-1">{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maharashtra Cultural & Festival Calendar Section */}
      <div className="bg-white dark:bg-[#1a1e26] rounded-2xl p-6 shadow-sm border border-gray-200/80 dark:border-gray-800 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {lang === 'mr' ? 'महाराष्ट्रातील प्रमुख सण व संस्कृती दिनदर्शिका' : 'Major Festivals & Cultural Calendar'}
            </h3>
            <p className="text-xs text-gray-500">
              {lang === 'mr' ? 'पारंपरिक सण, शेती उत्सव आणि महत्त्वाचे दिवस' : 'Traditional agricultural and state celebrations'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FESTIVALS_MARATHI.map((f, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-1 hover:border-amber-400 transition"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {lang === 'mr' ? f.nameMr : f.nameEn}
                </h4>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                {f.descMr}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
