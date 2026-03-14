'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="mn">
      <body style={{ fontFamily: 'sans-serif', margin: 0 }}>
        <div style={{
          minHeight: '100vh',
          background: '#060610',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)', margin: 0 }}>500</h1>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0.5rem 0' }}>Алдаа гарлаа</p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.5rem 0 1.5rem' }}>Системд алдаа гарлаа. Дахин оролдоно уу.</p>
            <button
              onClick={reset}
              style={{
                background: '#06b6d4',
                color: '#fff',
                fontWeight: 700,
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Дахин оролдох
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
