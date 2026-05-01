import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on backdrop click
  const handleOverlay = (e) => { if (e.target === overlayRef.current) onClose(); };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      className="animate-fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        background: 'rgba(4, 4, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Modal Panel */}
      <div
        className="animate-scale-in"
        style={{
          position: 'relative',
          width: '100%', maxWidth: '500px',
          maxHeight: '90vh', overflowY: 'auto',
          borderRadius: '24px',
          background: 'rgba(14, 14, 22, 0.97)',
          border: '1px solid rgba(139,92,246,0.2)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 60px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Animated gradient top border */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '1px', borderRadius: '24px 24px 0 0',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.8) 30%, rgba(99,102,241,0.6) 60%, rgba(139,92,246,0.4) 80%, transparent 100%)',
        }} />

        {/* Corner accents */}
        <div style={{
          position: 'absolute', top: '1px', left: '1px',
          width: '60px', height: '60px', borderRadius: '24px 0 0 0',
          background: 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Ambient glow behind modal */}
        <div style={{
          position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '100px',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.25) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(20px)',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 24px 16px',
          borderBottom: '1px solid rgba(139,92,246,0.1)',
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(14,14,22,0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px 24px 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Title accent */}
            <div style={{
              width: '3px', height: '22px',
              background: 'linear-gradient(to bottom, #8b5cf6, #6366f1)',
              borderRadius: '99px',
              boxShadow: '0 0 12px rgba(139,92,246,0.6)',
            }} />
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '18px', fontWeight: 800,
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
              margin: 0,
            }}>
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(244,63,94,0.12)';
              e.currentTarget.style.borderColor = 'rgba(244,63,94,0.25)';
              e.currentTarget.style.color = '#fda4af';
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
