import React, { useState } from 'react';
import {
  Code2,
  Search,
  BookOpen,
  Layers,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  GraduationCap,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function OOPConceptsPage({ concepts = [], cppSourceCode = '' }) {
  const { addToast } = useToast();
  const [activeView, setActiveView] = useState('concepts'); // 'concepts' | 'source' | 'hierarchy'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Core OOP', 'Inheritance', 'Polymorphism', 'Object Lifecycle', 'Advanced OOP', 'Generic Programming', 'Robustness', 'Persistence', 'Modern C++', 'Architecture'];

  const filteredConcepts = concepts.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchClass = c.classesInvolved && c.classesInvolved.some(cls => cls.toLowerCase().includes(q));
      const matchFunc = c.functionsInvolved && c.functionsInvolved.some(f => f.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchClass || matchFunc;
    }
    return true;
  });

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    addToast('Code snippet copied to clipboard!', 'info', 2000);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="card-surface p-6 sm:p-8 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 text-white border-none shadow-navy">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-500/20 text-accent-300 border border-accent-500/30 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            OOP Lab Project Architecture & Principles
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            16 C++ Object-Oriented Concepts
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Detailed mapping of each C++ paradigm implemented in <code className="text-accent-400 font-mono">library_management.cpp</code>,
            including classes, member functions, line numbers, and syntax snippets.
          </p>

          {/* View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => setActiveView('concepts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'concepts'
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Concept Cards ({concepts.length})</span>
            </button>

            <button
              onClick={() => setActiveView('hierarchy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'hierarchy'
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Class Hierarchy</span>
            </button>

            <button
              onClick={() => setActiveView('source')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'source'
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Full C++ Source Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Concepts Grid */}
      {activeView === 'concepts' && (
        <>
          {/* Search & Category Filter */}
          <div className="card-surface p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts (e.g. polymorphism, friend, static, fine)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {['All', 'Core OOP', 'Inheritance', 'Polymorphism', 'Advanced OOP'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-navy-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Concept Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredConcepts.map((item, index) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="card-surface p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div>
                    {/* Header: Number, Title & Category */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          {index + 1}
                        </span>
                        <h3 className="text-base font-bold text-navy-900">
                          {item.title}
                        </h3>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider whitespace-nowrap">
                        {item.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Classes & Functions Involved */}
                    <div className="space-y-2 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                          Classes Involved:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.classesInvolved.map((cls, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[11px] font-semibold text-navy-900"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                          Functions & Members:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.functionsInvolved.map((fn, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[11px] text-accent-700"
                            >
                              {fn}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Snippet Block */}
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-navy-950 text-slate-200 text-xs font-mono">
                    <div className="flex items-center justify-between px-3.5 py-2 bg-navy-900 border-b border-navy-800 text-[11px] text-slate-400">
                      <span>{item.lineRange}</span>
                      <button
                        onClick={() => handleCopy(item.codeSnippet, item.id)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                        title="Copy code"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                      <code>{item.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* VIEW 2: Class Hierarchy Diagram */}
      {activeView === 'hierarchy' && (
        <div className="card-surface p-6 sm:p-8 space-y-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-accent-500" />
              C++ Class Inheritance & Composition Tree
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Visualizes the relationship between the Abstract Base Class, Single & Multilevel Inheritance, and Composition.
            </p>
          </div>

          {/* Visual Architecture Chart */}
          <div className="p-6 rounded-2xl bg-navy-950 text-white font-mono text-xs sm:text-sm overflow-x-auto border border-navy-800">
            <pre className="text-emerald-400 leading-relaxed">
{`
                        +---------------------------+
                        |      Item (Abstract)      |
                        |---------------------------|
                        | - id: int                 |
                        | - title: string           |
                        | - memberId: int           |
                        | - static totalItems: int  |
                        |---------------------------|
                        | + calculateFine() = 0     |
                        | + getType() = 0           |
                        | + getDetail() = 0         |
                        | + issueTo(mid)            |
                        | + giveBack()              |
                        | + virtual ~Item()         |
                        +---------------------------+
                                     /  \\
                                    /    \\
        (Inheritance)              /      \\ (Inheritance)
                                  /        \\
              +---------------------+    +---------------------------+
              |        Book         |    |         Magazine          |
              |---------------------|    |---------------------------|
              | - author: string    |    | - issueNo: int            |
              |---------------------|    |---------------------------|
              | + calculateFine()   |    | + calculateFine()         |
              |   [Rs 2 per day]    |    |   [Rs 5 per day]          |
              +---------------------+    +---------------------------+
                         |
                         | (Multilevel Inheritance)
                         v
              +---------------------+
              |    ReferenceBook    |
              |---------------------|
              | + issueTo() [throws]|
              | + calculateFine()=0 |
              | (In-library only)   |
              +---------------------+


+------------------------+                    +------------------------------------+
|         Member         |                    |              Library               |
|------------------------|                    |------------------------------------|
| - id: int              | <--- COMPOSITION --| - items: vector<unique_ptr<Item>>  |
| - name: string         |      (Has-A)       | - members: vector<Member>          |
| + operator==(other)    |                    | - MAX_BORROW = 3                   |
+------------------------+                    | - ALLOWED_DAYS = 7                 |
                                              | + issue() / giveBack() / search()  |
                                              | + save() [destructor] / load()     |
                                              +------------------------------------+
`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-navy-900 block mb-1">1. Abstract Base Class</span>
              <p className="text-slate-600 leading-relaxed">
                <code className="text-accent-600 font-mono">Item</code> contains pure virtual functions. Instances are manipulated polymorphically via <code className="font-mono">std::unique_ptr&lt;Item&gt;</code>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-navy-900 block mb-1">2. Multilevel Inheritance</span>
              <p className="text-slate-600 leading-relaxed">
                <code className="text-accent-600 font-mono">ReferenceBook → Book → Item</code>. Overrides <code className="font-mono">issueTo()</code> to forbid checkout, throwing <code className="font-mono">LibraryException</code>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-navy-900 block mb-1">3. Composition Pattern</span>
              <p className="text-slate-600 leading-relaxed">
                <code className="text-accent-600 font-mono">Library</code> owns and manages the lifecycle of collections of both items and members, loading on startup and saving in its destructor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Full C++ Source Code Viewer */}
      {activeView === 'source' && (
        <div className="card-surface overflow-hidden">
          <div className="p-4 sm:p-5 bg-navy-900 text-white flex items-center justify-between border-b border-navy-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-accent-400" />
              <span className="font-mono text-xs sm:text-sm font-bold">library_management.cpp</span>
              <span className="text-xs text-slate-400 hidden sm:inline">(C++17 Single Source File)</span>
            </div>

            <button
              onClick={() => handleCopy(cppSourceCode, 'cpp-full')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-white transition-colors"
            >
              {copiedId === 'cpp-full' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Source</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Source Code</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-navy-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-[750px] leading-relaxed">
            <pre>
              <code>{cppSourceCode || '// Source code loading...'}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
