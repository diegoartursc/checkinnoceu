import React, { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Toast = memo(({ message, isVisible, onClose, duration = 3000 }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!show) return null;

  // Use Portal to ensure it's always on top of everything
  return createPortal(
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md text-slate-800 px-6 py-4 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3 min-w-[300px] max-w-[90vw]">
        <div className="w-2 h-8 bg-sky-400 rounded-full shrink-0"></div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-700 leading-snug">
            {message}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
});

Toast.displayName = 'Toast';

export default Toast;
