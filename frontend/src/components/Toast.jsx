import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`} role="alert">
      <span className="mr-2">{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
}
