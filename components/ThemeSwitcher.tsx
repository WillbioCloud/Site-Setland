import { useEffect, useRef, useState } from 'react';
import { Check, Palette, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { eras } from '../data/park';

export function ThemeSwitcher({ variant = 'compact' }: { variant?: 'compact' | 'hero' }) {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) setIsOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [isOpen]);

  const options = (
    <div className="era-options" role="group" aria-label="Escolha a atmosfera do site">
      {eras.map(({ id, number, icon: Icon, shortName }) => (
        <button
          key={id}
          className={`era-option ${currentTheme === id ? 'is-active' : ''}`}
          aria-pressed={currentTheme === id}
          onClick={() => {
            setTheme(id);
            setIsOpen(false);
            if (variant === 'compact') toggle.current?.focus();
          }}
        >
          <span className="era-option__number">{number}</span>
          <Icon size={19} strokeWidth={1.4} aria-hidden="true" />
          <span>{shortName}</span>
          {currentTheme === id && (
            <Check className="era-option__check" size={14} aria-hidden="true" />
          )}
        </button>
      ))}
      <button
        className="era-reset"
        onClick={() => {
          setTheme('default');
          setIsOpen(false);
          if (variant === 'compact') toggle.current?.focus();
        }}
        aria-pressed={currentTheme === 'default'}
      >
        <RotateCcw size={12} aria-hidden="true" /> Atmosfera original
      </button>
    </div>
  );

  if (variant === 'hero')
    return (
      <aside className="hero-era-switch">
        <span className="eyebrow">Sua viagem, sua era</span>
        {options}
      </aside>
    );

  return (
    <div className="theme-switcher" ref={ref}>
      <button
        ref={toggle}
        className="icon-button theme-switcher__toggle"
        aria-label="Alterar atmosfera"
        aria-expanded={isOpen}
        aria-controls="theme-options"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette size={19} strokeWidth={1.6} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="theme-switcher__panel" id="theme-options">
          <span className="eyebrow">Mude a atmosfera</span>
          <p>O mesmo destino. Um novo olhar.</p>
          {options}
        </div>
      )}
    </div>
  );
}
