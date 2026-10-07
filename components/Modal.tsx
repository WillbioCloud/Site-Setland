import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

let scrollLocks = 0;
let originalOverflow = '';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
  className?: string;
  closeLabel?: string;
}

/** Native dialogs provide focus trapping and make the page behind them inert. */
export function Modal({
  isOpen,
  onClose,
  titleId,
  children,
  className = '',
  closeLabel = 'Fechar janela',
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    if (scrollLocks++ === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    if (!dialog.open) dialog.showModal();

    return () => {
      dialog.close();
      if (--scrollLocks === 0) document.body.style.overflow = originalOverflow;
      if (previousFocus?.isConnected && !document.querySelector('dialog[open]'))
        previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-modal="true"
      className={`modal ${className}`}
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          closeRef.current();
      }}
    >
      <button
        className="icon-button modal__close"
        onClick={onClose}
        aria-label={closeLabel}
        autoFocus
      >
        <X size={21} aria-hidden="true" />
      </button>
      {children}
    </dialog>,
    document.body,
  );
}
