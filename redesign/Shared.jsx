// Shared.jsx — reusable section components

const SectionLabel = ({ children, style }) => (
  <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--color-text-tertiary)', marginBottom: 20, ...style }}>{children}</p>
);

const ProofBand = ({ label, stats }) => (
  <div style={{ background: 'var(--color-paper)', padding: '48px 40px',
    borderTop: '0.5px solid var(--color-line)', borderBottom: '0.5px solid var(--color-line)' }}>
    <SectionLabel>{label || 'What clients stop losing'}</SectionLabel>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
      {stats.map((s, i) => (
        <div key={i}>
          <p style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.015em',
            marginBottom: 6 }}>{s.value}</p>
          <p style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const Scene = ({ tag, before, after }) => (
  <div style={{ background: 'var(--color-canvas)', border: '0.5px solid var(--color-line)',
    borderRadius: 'var(--radius-lg)', padding: '24px 28px',
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 10 }}>
    <p style={{ gridColumn: '1 / -1', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
      paddingBottom: 14, borderBottom: '0.5px solid var(--color-line)', marginBottom: 4 }}>{tag}</p>
    <div>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: '#A32D2D', marginBottom: 6 }}>Before</p>
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, fontStyle: 'italic' }}>{before}</p>
    </div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: '#0F6E56', marginBottom: 6 }}>After</p>
      <p style={{ fontSize: 13, color: 'var(--color-text-primary)', lineHeight: 1.65 }}>{after}</p>
    </div>
  </div>
);

const IndustryCard = ({ tag, title, body, onClick }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: 'var(--color-canvas)', border: `0.5px solid ${hov ? 'var(--color-ink)' : 'var(--color-line)'}`,
        borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', flexDirection: 'column',
        minHeight: 240, cursor: 'pointer',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'border-color var(--motion-base), transform var(--motion-base)' }}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)', marginBottom: 14 }}>{tag}</p>
      <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</p>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: 'auto' }}>{body}</p>
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-signal)', marginTop: 20 }}>See the page →</p>
    </div>
  );
};

const HowItWorksSteps = ({ steps }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
    {steps.map((s, i) => (
      <div key={i} style={{ borderTop: '1px solid var(--color-ink)', paddingTop: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)', marginBottom: 10 }}>{s.period}</p>
        <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.35, marginBottom: 8 }}>{s.title}</p>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>{s.body}</p>
      </div>
    ))}
  </div>
);

const CompCard = ({ vs, title, body, conclusion }) => (
  <div style={{ background: 'var(--color-canvas)', border: '0.5px solid var(--color-line)',
    borderRadius: 'var(--radius-lg)', padding: 22, display: 'flex', flexDirection: 'column' }}>
    <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: 'var(--color-text-tertiary)', marginBottom: 10 }}>{vs}</p>
    <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, marginBottom: 8 }}>{title}</p>
    <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{body}</p>
    <p style={{ fontSize: 12, lineHeight: 1.55, fontWeight: 500, paddingTop: 10,
      borderTop: '0.5px solid var(--color-line)', marginTop: 'auto' }}>{conclusion}</p>
  </div>
);

const TierCard = ({ tier, featured }) => (
  <div style={{ background: 'var(--color-canvas)',
    border: featured ? '2px solid var(--color-signal)' : '0.5px solid var(--color-line)',
    borderRadius: 'var(--radius-lg)', padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
    {featured && (
      <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '3px 10px',
        borderRadius: 'var(--radius-sm)', background: 'var(--color-signal)',
        color: 'white', marginBottom: 10, alignSelf: 'flex-start' }}>Most common starting point</span>
    )}
    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{tier.name}</p>
    <p style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.015em', margin: '8px 0 4px' }}>
      {tier.price}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-tertiary)' }}>/mo</span>
    </p>
    <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 20, lineHeight: 1.5 }}>{tier.sub}</p>
    <ul style={{ listStyle: 'none', padding: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 2 }}>
      {tier.features.map((f, i) => <li key={i}>{f}</li>)}
    </ul>
    {tier.note && (
      <p style={{ fontSize: 11, color: 'var(--color-signal)', marginTop: 16, paddingTop: 14,
        borderTop: '0.5px solid var(--color-line)', lineHeight: 1.5 }}>{tier.note}</p>
    )}
  </div>
);

const ProcessList = ({ steps }) => (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {steps.map((s, i) => (
      <li key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start',
        padding: '20px 0', borderBottom: i < steps.length - 1 ? '0.5px solid var(--color-line)' : 'none' }}>
        <div style={{ minWidth: 36, height: 36, borderRadius: '50%', background: 'var(--color-paper)',
          fontSize: 14, fontWeight: 500, color: 'var(--color-text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{s.title}</p>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: s.ai ? 6 : 0 }}>{s.body}</p>
          {s.ai && <p style={{ fontSize: 12, color: 'var(--color-signal)', lineHeight: 1.5 }}>{s.ai}</p>}
        </div>
      </li>
    ))}
  </ul>
);

const FinalBand = ({ headline, body, cta, meta }) => (
  <div style={{ background: 'var(--color-ink)', color: 'var(--color-canvas)', padding: '80px 40px' }} id="contact">
    <h2 style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2,
      color: 'var(--color-canvas)', marginBottom: 18, maxWidth: 560 }}>{headline}</h2>
    <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-canvas)', opacity: 0.72,
      marginBottom: 28, maxWidth: 540 }}>{body}</p>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <a href="https://book.neo.space/replikte/30-min" target="_blank" rel="noopener"
        style={{ fontSize: 14, fontWeight: 500,
        background: 'var(--color-canvas)', color: 'var(--color-ink)',
        borderRadius: 'var(--radius-md)', padding: '12px 22px', textDecoration: 'none' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >{cta}</a>
      <span style={{ fontSize: 13, color: 'var(--color-canvas)', opacity: 0.55 }}>{meta || '30 minutes. No pitch deck. No demo.'}</span>
    </div>
  </div>
);

const SOCIALS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/replikte' },
  { label: 'X', url: 'https://x.com/ReplikteAI' },
];

const Footer = ({ onNavigate }) => (
  <footer style={{ padding: '40px', borderTop: '0.5px solid var(--color-line)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <svg width="22" height="14" viewBox="0 0 28 18">
            <path d="M 2 4 L 2 14 L 10 9 Z" fill="var(--color-signal)"/>
            <path d="M 26 4 L 26 14 L 18 9 Z" fill="var(--color-signal)"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.015em' }}>replikte</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', maxWidth: 220, lineHeight: 1.6 }}>The operating layer your business has always needed.</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-tertiary)'}
            >{s.label}</a>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 48 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)', marginBottom: 12 }}>Industries</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['construction', 'Construction'], ['trades', 'Trades'], ['law', 'Law firms']].map(([p, label]) => (
              <li key={p}><a href="#" onClick={e => { e.preventDefault(); onNavigate(p); }}
                style={{ fontSize: 13, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
              >{label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)', marginBottom: 12 }}>Company</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['about', 'About']].map(([p, label]) => (
              <li key={p}><a href="#" onClick={e => { e.preventDefault(); onNavigate(p); }}
                style={{ fontSize: 13, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
              >{label}</a></li>
            ))}
            <li><a href="https://book.neo.space/replikte/30-min" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
            >Book a call</a></li>
          </ul>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)', marginBottom: 12 }}>Legal</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><a href="privacy.html"
              style={{ fontSize: 13, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
            >Privacy policy</a></li>
            <li><a href="terms.html"
              style={{ fontSize: 13, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
            >Terms of use</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div style={{ marginTop: 40, paddingTop: 20, borderTop: '0.5px solid var(--color-line)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>© 2026 Replikte LLC — Boca Raton, FL</p>
      <a href="mailto:contact@replikte.com" style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'none' }}
        onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
        onMouseLeave={e => e.target.style.color = 'var(--color-text-tertiary)'}
      >contact@replikte.com</a>
    </div>
  </footer>
);

const Section = ({ children, tinted, id, style }) => (
  <div id={id} style={{
    padding: '88px 40px',
    ...(tinted ? { background: 'var(--color-paper)', borderTop: '0.5px solid var(--color-line)', borderBottom: '0.5px solid var(--color-line)' } : {}),
    ...style
  }}>{children}</div>
);

const WideSection = ({ children, tinted, id }) => (
  <Section tinted={tinted} id={id}>
    <div style={{ maxWidth: 680 }}>{children}</div>
  </Section>
);

const H2 = ({ children, style }) => (
  <h2 style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.015em',
    marginBottom: 20, ...style }}>{children}</h2>
);

const Body = ({ children, style }) => (
  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-text-secondary)', marginBottom: 14, ...style }}>{children}</p>
);

const Testimonials = ({ items }) => (
  <Section>
    <SectionLabel>What clients say</SectionLabel>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {items.map((t, i) => (
        <div key={i} style={{ background: 'var(--color-canvas)', border: '0.5px solid var(--color-line)',
          borderRadius: 'var(--radius-lg)', padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-primary)',
            marginBottom: 24, fontStyle: 'normal', flex: 1 }}>"{t.quote}"</p>
          <div style={{ borderTop: '0.5px solid var(--color-line)', paddingTop: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>{t.name}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{t.title}</p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

Object.assign(window, {
  SectionLabel, ProofBand, Scene, IndustryCard,
  HowItWorksSteps, CompCard, TierCard, ProcessList,
  FinalBand, Footer, Section, WideSection, H2, Body, Testimonials
});
