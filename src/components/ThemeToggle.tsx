'use client';

import { useEffect, useState, useRef } from 'react';

type Theme = 'light' | 'dark' | 'midnight' | 'forest' | 'sunset';

interface ThemeConfig {
  name: string;
  icon: string;
  preview: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
}

const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: 'Claro',
    icon: '☀️',
    preview: {
      bg: '#f5f3ff',
      card: '#ffffff',
      accent: '#9333ea',
      text: '#1f2937',
    },
  },
  dark: {
    name: 'Oscuro',
    icon: '🌙',
    preview: {
      bg: '#111827',
      card: '#1f2937',
      accent: '#a855f7',
      text: '#f3f4f6',
    },
  },
  midnight: {
    name: 'Medianoche',
    icon: '✨',
    preview: {
      bg: '#0a0a1a',
      card: '#1e1b4b',
      accent: '#a78bfa',
      text: '#c7d2fe',
    },
  },
  forest: {
    name: 'Océano',
    icon: '🌊',
    preview: {
      bg: '#0c1426',
      card: '#0e2a47',
      accent: '#38bdf8',
      text: '#bae6fd',
    },
  },
  sunset: {
    name: 'Atardecer',
    icon: '🌅',
    preview: {
      bg: '#1a0a0a',
      card: '#4a1c2e',
      accent: '#fb923c',
      text: '#fed7aa',
    },
  },
};

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ThemePreview({ config, isSelected }: { config: ThemeConfig; isSelected: boolean }) {
  return (
    <div
      className="w-12 h-8 rounded-md overflow-hidden relative border-2 transition-all"
      style={{
        backgroundColor: config.preview.bg,
        borderColor: isSelected ? config.preview.accent : 'transparent',
      }}
    >
      <div
        className="absolute bottom-1 left-1 right-1 h-3 rounded-sm"
        style={{ backgroundColor: config.preview.card }}
      >
        <div
          className="absolute top-1 left-1 w-4 h-1 rounded-full"
          style={{ backgroundColor: config.preview.accent }}
        />
      </div>
      {isSelected && (
        <div
          className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.preview.accent }}
        >
          <CheckIcon className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
  );
}

export default function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (document.documentElement.classList.contains('dark')) {
      setCurrentTheme('dark');
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    // Limpiar clases de tema anteriores
    root.classList.remove('dark', 'theme-midnight', 'theme-forest', 'theme-sunset');

    // Aplicar nuevo tema
    switch (theme) {
      case 'dark':
        root.classList.add('dark');
        break;
      case 'midnight':
        root.classList.add('dark', 'theme-midnight');
        break;
      case 'forest':
        root.classList.add('dark', 'theme-forest');
        break;
      case 'sunset':
        root.classList.add('dark', 'theme-sunset');
        break;
      // light no necesita clase
    }
  };

  const selectTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  if (!mounted) {
    return <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800" />;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        aria-label="Cambiar tema"
      >
        <PaletteIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Seleccionar tema
          </div>
          {(Object.keys(themes) as Theme[]).map((themeKey) => {
            const config = themes[themeKey];
            const isSelected = currentTheme === themeKey;
            return (
              <button
                key={themeKey}
                onClick={() => selectTheme(themeKey)}
                className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
              >
                <ThemePreview config={config} isSelected={isSelected} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {config.name}
                </span>
                <span className="text-base ml-auto">{config.icon}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
