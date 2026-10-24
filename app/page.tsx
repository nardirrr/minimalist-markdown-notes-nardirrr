'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const loadDefaultNote = () => {
    const now = Date.now();

    const welcomeNote: Note = {
      id: (now - 1).toString(), // Offset ensures IDs never collide
      title: 'README',
      content: '# Hello Markdown\n\nStart typing on the left hand side. Watch it render on the right hand side, using markdown formatting.\n\nZero backend database\n\nFully local, not cloud based\n\n **Markdown Syntax**\n\n ** Before and after will be bold\n\n "*" Before (with space) will be a list / bulletpoint\n\n "*" With no space, before and after is italic\n\n **Test Bold**\n\n *Test Italic*\n\n* Test List\n\n # Before text (with space) is a heading',
      updatedAt: now - 1,
    };

    const initialBlankNote: Note = {
      id: now.toString(),
      title: 'Untitled Note',
      content: '# New Note\n\n',
      updatedAt: now,
    };

    // Puts the blank note at the top of the sidebar list, instructions below it
    setNotes([initialBlankNote, welcomeNote]);

    // Opens directly to the blank note
    setActiveId(initialBlankNote.id);
  };

  // Load notes and theme preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('markdown_notes');
    const savedTheme = localStorage.getItem('markdown_theme');
    if (savedTheme !== null) {
      setIsDark(savedTheme === 'dark');
    }

    if (saved) {
      try {
        const parsed: Note[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setNotes(parsed);
          setActiveId(parsed[0].id);
        } else {
          loadDefaultNote();
        }
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
        loadDefaultNote();
      }
    } else {
      loadDefaultNote();
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('markdown_notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Save theme to localStorage
  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('markdown_theme', nextTheme ? 'dark' : 'light');
  };

  const activeNote = notes.find((n) => n.id === activeId) || notes[0];

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '# New Note\n\nWrite your thoughts here...',
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveId(newNote.id);
    setIsSidebarOpen(false); // Close drawer on mobile after creating
  };

  const updateContent = (content: string) => {
    if (!activeNote) return;

    const firstLine = content.split('\n')[0].replace(/^#+\s*/, '') || 'Untitled Note';

    setNotes(
      notes.map((n) =>
        n.id === activeNote.id
          ? { ...n, content, title: firstLine, updatedAt: Date.now() }
          : n
      )
    );
  };

  const deleteSpecificNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (activeId === id && remaining.length > 0) {
      setActiveId(remaining[0].id);
    } else if (remaining.length === 0) {
      localStorage.removeItem('markdown_notes');
      loadDefaultNote();
    }
  };

  const clearAllNotes = () => {
    if (confirm('Are you sure you want to wipe all notes and reset local storage? This is irreversible. Once done, you will be returned to the initial note again !!!')) {
      localStorage.removeItem('markdown_notes');
      loadDefaultNote();
    }
  };

  // Theme styling classes mapping
  const theme = {
    mainBg: isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900',
    sidebarBg: isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200',
    borderCol: isDark ? 'border-zinc-800' : 'border-zinc-200',
    activeItem: isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-950',
    hoverItem: isDark ? 'hover:bg-zinc-900 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600',
    inputBg: isDark ? 'bg-zinc-950 text-zinc-200 placeholder-zinc-700' : 'bg-white text-zinc-800 placeholder-zinc-400',
    previewBg: isDark ? 'bg-zinc-900/20' : 'bg-zinc-50/50',
    proseMode: isDark ? 'prose-invert' : '',
    headerText: isDark ? 'text-zinc-500' : 'text-zinc-400',
  };

  return (
    <main className={`flex h-screen font-sans overflow-hidden relative ${theme.mainBg}`}>
      {/* Mobile Top Navigation Bar */}
      <div className={`md:hidden absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2.5 border-b ${theme.sidebarBg} ${theme.borderCol}`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-xs font-medium px-2.5 py-1.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-200"
        >
          {isSidebarOpen ? 'Close Menu ✕' : '☰ Notes Menu'}
        </button>
        <span className="text-xs font-semibold truncate max-w-[160px]">{activeNote?.title || 'Notes'}</span>
        <button
          onClick={toggleTheme}
          className="text-xs px-2 py-1 rounded border border-zinc-700"
        >
          {isDark ? 'Dark 🌙' : 'Light☀️'}
        </button>
      </div>

      {/* Sidebar: Note List (Drawer on mobile, Fixed sidebar on desktop) */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-30 w-72 border-r flex flex-col transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${theme.sidebarBg} ${theme.borderCol}
        pt-12 md:pt-0
      `}>
        <div className={`p-4 border-b flex items-center justify-between ${theme.borderCol}`}>
          <h1 className="font-semibold text-sm tracking-wide">Notes App</h1>
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`px-2.5 py-1.5 text-xs font-medium rounded border transition ${theme.borderCol} ${theme.hoverItem}`}
              title="Toggle Theme"
            >
              {isDark ? 'Dark 🌙 ' : 'Light☀️'}
            </button>
            <button
              onClick={createNote}
              className={`px-3 py-1.5 text-xs font-medium rounded transition ${isDark ? 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
            >
              New Note
            </button>
          </div>
          {/* Mobile quick action button inside header drawer */}
          <button
            onClick={createNote}
            className={`md:hidden px-3 py-1.5 text-xs font-medium rounded transition ${isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 text-white'}`}
          >
            New Note
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setActiveId(note.id);
                setIsSidebarOpen(false);
              }}
              className={`group px-3 py-2.5 rounded cursor-pointer flex items-center justify-between transition ${note.id === activeId ? theme.activeItem : theme.hoverItem}`}
            >
              <div className="truncate text-xs font-medium pr-2">{note.title}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSpecificNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 text-xs px-1 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Clear Storage Button */}
        <div className={`p-3 border-t ${theme.borderCol}`}>
          <button
            onClick={clearAllNotes}
            className="w-full py-2 bg-red-950/40 text-red-400 border border-red-900/50 text-xs font-medium rounded hover:bg-red-900/40 transition"
          >
            Clear All Data / Cache
          </button>
        </div>
      </aside>

      {/* Main Split Pane */}
      {activeNote ? (
        <div className={`flex-1 flex flex-col md:grid md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x ${theme.borderCol} pt-12 md:pt-0`}>
          {/* Left: Raw Input */}
          <div className="flex flex-col h-[50vh] md:h-full">
            <div className={`px-6 py-3 border-b text-xs font-medium uppercase tracking-wider ${theme.borderCol} ${theme.headerText}`}>
              Markdown Input
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateContent(e.target.value)}
              className={`flex-1 p-6 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed ${theme.inputBg}`}
              placeholder="Type markdown here..."
            />
          </div>

          {/* Right: Live Preview */}
          <div className={`flex flex-col h-[50vh] md:h-full overflow-hidden ${theme.previewBg}`}>
            <div className={`px-6 py-3 border-b flex items-center justify-between text-xs font-medium uppercase tracking-wider ${theme.borderCol} ${theme.headerText}`}>
              <span>Live Preview</span>
              <button
                onClick={() => deleteSpecificNote(activeNote.id)}
                className="text-red-400 hover:text-red-300 transition normal-case tracking-normal text-xs"
              >
                Delete this note
              </button>
            </div>
            <div className={`flex-1 p-6 overflow-y-auto prose max-w-none text-sm leading-relaxed ${theme.proseMode}`}>
              <ReactMarkdown>{activeNote.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
          No notes selected. Create one to begin.
        </div>
      )}
    </main>
  );
}