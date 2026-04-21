// PageHome.jsx

const PROOF_STATS_HOME = [
  { value: '10–15 hrs', label: 'returned to the owner each week — time previously spent on coordination and follow-up' },
  { value: '3–9%', label: 'of revenue recovered — from unbilled time, missed follow-ups, and uncaptured charges' },
  { value: 'Week 6', label: 'when the system is fully running inside the business — not month six, not year two' },
  { value: '24/7', label: 'the system works — not just when someone remembers to open the software' },
];

const HOW_STEPS_HOME = [
  { period: 'Weeks 1–2', title: 'We walk your operation', body: 'We study how your business runs — your tools, your flow, your team communication.' },
  { period: 'Week 3', title: 'We show you the number', body: 'A concrete dollar figure on what\'s leaking — unbilled time, missed follow-ups, lost customers.' },
  { period: 'Weeks 4–6', title: 'We build and activate', body: 'AI systems go live inside the tools your team already uses. No new interface. No training.' },
  { period: 'Month 2+', title: 'We run it, permanently', body: 'Monthly retainer. We monitor, tune, and expand as your business changes.' },
];

const COMPARISON_ITEMS = [
  { vs: 'Vs. hiring a COO', title: 'A good ops hire costs $85k+ a year.', body: 'They take months to learn your business, and eventually leave.', conclusion: 'Our system is inside your business in weeks, and it doesn\'t leave.' },
  { vs: 'Vs. ops software', title: 'Software waits to be opened.', body: 'When things get busy, nobody opens it. Follow-ups don\'t go out.', conclusion: 'Our system acts without being asked. Every day.' },
  { vs: 'Vs. a consultant', title: 'Consultants diagnose. Then leave.', body: 'You get a report and a bill. Execution is your problem.', conclusion: 'We diagnose, build, and run. Permanently.' },
  { vs: 'Vs. offshore VAs', title: 'Cheap labor only gets you so far.', body: 'People quit. People forget. Service depends on who\'s assigned this month.', conclusion: 'A system doesn\'t have bad weeks and doesn\'t quit.' },
];

const HOME_TESTIMONIALS = [
  {
    quote: 'The change order disputes just stopped. We used to lose $8–12k a year to verbal agreements nobody could prove. Now everything\'s documented the same day it\'s discussed. I stopped thinking about it.',
    name: 'Marcus T.',
    title: 'Owner, 22-person general contractor — South Florida',
  },
  {
    quote: 'I sent out 40 estimates in March. By April I had eight jobs I probably would have lost — just from the follow-up sequence running automatically. That\'s not counting the maintenance customers who came back.',
    name: 'Donna R.',
    title: 'Owner, HVAC company — 14 technicians',
  },
  {
    quote: 'My paralegal used to spend two hours a day on status emails and document chasing. She doesn\'t anymore. Clients stopped calling because they\'re already informed. The bar complaint risk is just gone.',
    name: 'James K.',
    title: 'Managing partner, family law firm — 6 attorneys',
  },
];

// ── Hero visual: abstract geometric composition ──────────────────────
const HeroVisual = () => (
  <div style={{ flex: '0 0 360px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 16 }}>
    <svg viewBox="0 0 340 320" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 340 }} aria-hidden="true">

      {/* Background surface */}
      <rect x="20" y="12" width="300" height="296" rx="14"
        fill="var(--color-paper)" stroke="var(--color-line)" strokeWidth="0.5"/>

      {/* Top row: two process blocks */}
      <rect x="40" y="36" width="118" height="72" rx="8"
        fill="var(--color-canvas)" stroke="var(--color-line)" strokeWidth="0.5"/>
      <rect x="182" y="36" width="118" height="72" rx="8"
        fill="var(--color-canvas)" stroke="var(--color-line)" strokeWidth="0.5"/>

      {/* Top block content lines */}
      <rect x="54" y="52" width="52" height="3" rx="1.5" fill="var(--color-line)"/>
      <rect x="54" y="61" width="78" height="3" rx="1.5" fill="var(--color-line)" opacity="0.6"/>
      <rect x="54" y="70" width="64" height="3" rx="1.5" fill="var(--color-line)" opacity="0.4"/>
      <rect x="54" y="88" width="36" height="3" rx="1.5" fill="var(--color-signal)" opacity="0.6"/>

      <rect x="196" y="52" width="52" height="3" rx="1.5" fill="var(--color-line)"/>
      <rect x="196" y="61" width="78" height="3" rx="1.5" fill="var(--color-line)" opacity="0.6"/>
      <rect x="196" y="70" width="64" height="3" rx="1.5" fill="var(--color-line)" opacity="0.4"/>
      <rect x="196" y="88" width="36" height="3" rx="1.5" fill="var(--color-line)" opacity="0.4"/>

      {/* Connector lines from top row down */}
      <line x1="99" y1="108" x2="99" y2="128" stroke="var(--color-line)" strokeWidth="0.5"/>
      <line x1="241" y1="108" x2="241" y2="128" stroke="var(--color-line)" strokeWidth="0.5"/>
      <line x1="99" y1="128" x2="241" y2="128" stroke="var(--color-line)" strokeWidth="0.5"/>
      <line x1="170" y1="128" x2="170" y2="144" stroke="var(--color-line)" strokeWidth="0.5"/>

      {/* Middle: signal block (featured/active) */}
      <rect x="80" y="144" width="180" height="80" rx="10"
        fill="var(--color-signal)"/>

      {/* Signal block content */}
      <rect x="98" y="162" width="64" height="3" rx="1.5" fill="white" opacity="0.9"/>
      <rect x="98" y="172" width="104" height="3" rx="1.5" fill="white" opacity="0.55"/>
      <rect x="98" y="182" width="88" height="3" rx="1.5" fill="white" opacity="0.4"/>
      <rect x="98" y="196" width="48" height="14" rx="5" fill="white" opacity="0.18"/>
      <rect x="154" y="196" width="48" height="14" rx="5" fill="white" opacity="0.18"/>

      {/* Connector from signal block down */}
      <line x1="170" y1="224" x2="170" y2="244" stroke="var(--color-line)" strokeWidth="0.5"/>

      {/* Bottom row: two output blocks */}
      <rect x="40" y="244" width="118" height="60" rx="8"
        fill="var(--color-canvas)" stroke="var(--color-line)" strokeWidth="0.5"/>
      <rect x="182" y="244" width="118" height="60" rx="8"
        fill="var(--color-canvas)" stroke="var(--color-line)" strokeWidth="0.5"/>

      {/* Bottom split connector */}
      <line x1="170" y1="244" x2="99" y2="244" stroke="var(--color-line)" strokeWidth="0.5"/>
      <line x1="170" y1="244" x2="241" y2="244" stroke="var(--color-line)" strokeWidth="0.5"/>

      {/* Bottom block content */}
      <rect x="54" y="260" width="52" height="3" rx="1.5" fill="var(--color-line)"/>
      <rect x="54" y="270" width="80" height="3" rx="1.5" fill="var(--color-line)" opacity="0.5"/>
      <rect x="54" y="284" width="36" height="3" rx="1.5" fill="var(--color-signal)" opacity="0.5"/>

      <rect x="196" y="260" width="52" height="3" rx="1.5" fill="var(--color-line)"/>
      <rect x="196" y="270" width="80" height="3" rx="1.5" fill="var(--color-line)" opacity="0.5"/>
      <rect x="196" y="284" width="36" height="3" rx="1.5" fill="var(--color-signal)" opacity="0.5"/>
    </svg>
  </div>
);

const PageHome = ({ onNavigate }) => (
  <>
    {/* Hero — two column */}
    <div style={{ padding: '80px 40px 72px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)', marginBottom: 24 }}>AI operations for real businesses</p>
        <h1 style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 20 }}>
          The operating layer your business has always needed. Now it doesn't require more people to run it.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: 14 }}>
          Replikte builds AI systems that handle the coordination, communication, and follow-through that currently depend on whoever has the most bandwidth — so the people who built the business can get back to the work that actually requires them.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-tertiary)', marginBottom: 32 }}>
          Not new software to learn. Not a consultant who leaves. A system that runs inside your operation every day.
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="https://calendly.com/replikte/30min" target="_blank" rel="noopener"
            style={{ fontSize: 14, fontWeight: 500, background: 'var(--color-ink)',
              color: 'var(--color-canvas)', borderRadius: 'var(--radius-md)', padding: '12px 22px',
              textDecoration: 'none', transition: 'opacity var(--motion-fast)' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >Book a 30-minute conversation</a>
          <a href="#how" style={{ fontSize: 14, fontWeight: 500, background: 'transparent',
            color: 'var(--color-text-primary)', border: '0.5px solid var(--color-line)',
            borderRadius: 'var(--radius-md)', padding: '11px 20px', textDecoration: 'none',
            transition: 'background var(--motion-fast)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-paper)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >See how it works</a>
          <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 4 }}>No pitch deck. No demo.</span>
        </div>
      </div>
      <HeroVisual />
    </div>

    <ProofBand stats={PROOF_STATS_HOME} />

    {/* Problem */}
    <WideSection>
      <SectionLabel>The problem we exist to solve</SectionLabel>
      <H2>Your competitors with twice the staff aren't better at the work. They just have more people handling everything around it.</H2>
      <Body>Every small business hits the same wall. The actual work — building, fixing, practicing, serving — is fine. It's the layer around the work that breaks down. The follow-up that didn't go out. The status call that took 20 minutes to answer. The estimate that sat for two weeks while the customer went elsewhere.</Body>
      <Body>For decades, the only answer was <strong>hire more people</strong>. For a 200-person company, that works. For a 15-person contractor or a 4-attorney firm, it doesn't.</Body>
      <Body><strong>Replikte exists because that trade-off is no longer necessary.</strong> We build AI systems that run the operational layer of small businesses permanently.</Body>
    </WideSection>

    {/* Industries */}
    <Section tinted id="industries">
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <SectionLabel>Pick your business</SectionLabel>
        <H2 style={{ fontSize: 28, marginBottom: 12 }}>Same idea. Your language.</H2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-secondary)', maxWidth: 560 }}>One company, three industry translations. Each page speaks only to you — not to every small business we serve.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <IndustryCard tag="Construction & contracting" title="Things stop falling through the cracks."
          body="Subs, change orders, compliance docs, billing, client updates — handled without you holding it all together."
          onClick={() => onNavigate('construction')} />
        <IndustryCard tag="Home services & trades" title="Slow season becomes optional."
          body="Estimates followed up, maintenance customers reactivated, reviews captured — your customer base working year-round."
          onClick={() => onNavigate('trades')} />
        <IndustryCard tag="Small & mid-size law firms" title="The status calls stop coming in."
          body="Intake, client communication, deadline tracking, document chasing — running without depending on whoever remembers."
          onClick={() => onNavigate('law')} />
      </div>
    </Section>

    {/* How it works */}
    <Section id="how">
      <div style={{ maxWidth: 600, marginBottom: 40 }}>
        <SectionLabel>How Replikte works</SectionLabel>
        <H2>We don't give advice and leave. We install and stay.</H2>
        <Body>Every engagement follows the same four steps. No months of rollout. No training programs for your team.</Body>
      </div>
      <HowItWorksSteps steps={HOW_STEPS_HOME} />
    </Section>

    {/* Testimonials */}
    <Testimonials items={HOME_TESTIMONIALS} />

    {/* Comparison */}
    <Section tinted>
      <div style={{ maxWidth: 640, marginBottom: 40 }}>
        <SectionLabel>Why Replikte is a different category</SectionLabel>
        <H2 style={{ fontSize: 28, marginBottom: 12 }}>We're not a consultant. We're not software. We're not a staffing agency.</H2>
        <Body style={{ fontSize: 15 }}>Every alternative has a specific limitation that Replikte doesn't share.</Body>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {COMPARISON_ITEMS.map((item, i) => <CompCard key={i} {...item} />)}
      </div>
    </Section>

    <FinalBand
      headline={"Start with one question:\nwhat keeps falling apart?"}
      body="Tell us the one thing in your operation that keeps breaking down. We'll tell you honestly whether we can fix it, and what it would look like if we did."
      cta="Book a 30-minute conversation"
    />
  </>
);

Object.assign(window, { PageHome });
