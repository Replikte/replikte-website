// Nav.jsx — sticky navigation
const Nav = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isVertical = ['construction', 'trades', 'law'].includes(currentPage);
  const links = currentPage === 'about'
    ? [{ label: 'Home', page: 'home' }, { label: 'Industries', page: 'home', hash: '#industries' }, { label: 'Contact', hash: '#contact' }]
    : isVertical
    ? [{ label: 'How it works', hash: '#how' }, { label: 'Pricing', hash: '#pricing' }, { label: 'About', page: 'about' }]
    : [{ label: 'How it works', hash: '#how' }, { label: 'Industries', hash: '#industries' }, { label: 'About', page: 'about' }];

  const handleLink = (e, link) => {
    if (link.page) { e.preventDefault(); onNavigate(link.page); }
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 40px', height: 60,
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--color-canvas)',
      borderBottom: '0.5px solid var(--color-line)',
      transition: 'box-shadow var(--motion-fast)',
    }}>
      <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 16, fontWeight: 500, letterSpacing: '-0.015em',
        color: 'var(--color-text-primary)', textDecoration: 'none',
      }}>
        <svg width="28" height="18" viewBox="0 0 28 18">
          <path d="M 2 4 L 2 14 L 10 9 Z" fill="var(--color-signal)"/>
          <path d="M 26 4 L 26 14 L 18 9 Z" fill="var(--color-signal)"/>
        </svg>
        <span>replikte</span>
      </a>

      <ul style={{ display: 'flex', gap: 28, fontSize: 13, listStyle: 'none', padding: 0, margin: 0 }}>
        {links.map(l => (
          <li key={l.label}>
            <a
              href={l.hash || '#'}
              onClick={e => handleLink(e, l)}
              style={{ color: 'var(--color-text-secondary)', textDecoration: 'none',
                transition: 'color var(--motion-fast)' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
            >{l.label}</a>
          </li>
        ))}
      </ul>

      <a href="https://calendly.com/replikte/30min" target="_blank" rel="noopener" style={{
        fontSize: 13, fontWeight: 500,
        background: 'var(--color-ink)', color: 'var(--color-canvas)',
        borderRadius: 8, padding: '8px 16px',
        textDecoration: 'none', transition: 'opacity var(--motion-fast)',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >Book a call</a>
    </nav>
  );
};

Object.assign(window, { Nav });
