// PageLaw.jsx

const PROOF_LAW = [
  { value: '35–40%', label: 'of attorney time in small firms goes to non-billable admin, coordination, and status calls' },
  { value: '42%', label: 'of bar complaints cite poor communication — not legal errors' },
  { value: '~60%', label: 'of inbound leads that don\'t get a same-day response choose another firm' },
  { value: '$0', label: 'billed for most client status calls — attorneys absorb the cost, every time' },
];

const SCENES_LAW = [
  { tag: 'Client intake & lead response', before: '"Someone called Friday afternoon about a potential PI case. We didn\'t get back to them until Monday. They\'d already signed with another firm."', after: 'Every inbound inquiry gets an immediate, intelligent response — gathering key facts, setting expectations, scheduling the consultation. By Monday, the lead is warm and booked.' },
  { tag: 'Client communication between hearings', before: '"Four clients called this week just asking \'what\'s happening.\' I billed none of it. Each call was 10 minutes of explaining we\'re waiting on the court."', after: 'Clients receive proactive updates at key milestones — filings submitted, hearings scheduled, documents received. The "just checking in" call disappears.' },
  { tag: 'Deadline & docket tracking', before: '"We rely on Sarah for docket management. When she was out for two weeks, I was personally checking every matter every morning."', after: 'Every deadline, every filing window, every response due date tracked and surfaced to the right person with enough lead time to act. The firm\'s docket doesn\'t live in one person\'s head.' },
  { tag: 'Document collection & chasing', before: '"We\'ve been waiting three weeks for the client to send financial disclosures. My paralegal has emailed twice. The case is stalled."', after: 'Document requests go out with clear instructions and automatic follow-up sequences. Clients get reminded at 48 hours, day five, day ten. Cases stop stalling.' },
  { tag: 'Estate planning & recurring client relationships', before: '"I drafted wills and trusts for 180 clients over six years. Most need updates. I have no system to know who or when."', after: 'Annual review prompts go out automatically — flagging clients whose documents are aging or whose circumstances suggest a review is due. Existing clients become recurring revenue.' },
  { tag: 'Real estate closings & third-party coordination', before: '"A closing fell through because the lender hadn\'t sent the disclosure and nobody caught it until the day before."', after: 'Every closing has a tracked checklist — title, lender docs, agent confirmations. Missing items surface automatically with enough time to fix them.' },
];

const TIERS_LAW = [
  { name: 'Foundations', price: '$1,800', sub: 'One critical breakdown, fixed permanently',
    features: ['2-week intake & workflow audit', 'One AI system — intake, comms, or deadlines', 'We run it, you don\'t manage it', 'Monthly review & tuning'],
    note: 'Good entry point for firms that want to see results on one problem first' },
  { name: 'Full practice ops', price: '$4,000', sub: 'Intake, client comms, deadlines, document chasing — all running',
    features: ['4-week deep audit across all practice areas', 'Intake response, matter updates, deadline tracking', 'Document collection & third-party coordination', 'Existing client outreach & relationship management', 'Bi-weekly reviews & continuous tuning'],
    note: 'The system learns your matters and clients — gets sharper month over month' },
  { name: 'Growth partner', price: '$7,500', sub: 'Built to scale the firm',
    features: ['Everything in Full practice ops', 'Referral network tracking & nurturing', 'New practice area or attorney onboarding', 'Custom workflows per practice area', 'Weekly strategic sessions'],
    note: 'For managing partners actively growing headcount or opening a second location' },
];

const PROCESS_LAW = [
  { title: 'We map your matter flow and find the gaps (weeks 1–2)', body: 'We look at how intake works, how client communication happens, how deadlines are tracked, and where things depend on one person\'s memory. We\'re auditing the operational layer, not the legal work.', ai: 'This is how our system learns your firm\'s workflow — your practice areas, matter types, typical timelines.' },
  { title: 'We show you exactly where the exposure and revenue loss are (week 3)', body: 'We put a number on unbilled coordination time, leads lost to slow intake, and existing clients overdue for outreach. You decide which to address first.' },
  { title: 'We build and activate inside your existing tools (weeks 4–6)', body: 'The AI systems connect to your practice management software, your email, your intake forms. Your team doesn\'t change how they work.', ai: 'Your attorneys don\'t interact with any new system. They just notice the status calls stop coming in.' },
  { title: 'We run it, permanently (month 2 onward)', body: 'Monthly retainer. We monitor, tune, and expand as your docket grows or practice areas shift. You don\'t manage it.', ai: 'What we build in month one works better in month six. Every matter adds to what the system knows.' },
];

const LAW_PILLS = ['Family law', 'Personal injury', 'Estate planning', 'Real estate', 'Criminal defense', 'Immigration', 'Business law', 'Employment'];

const PageLaw = () => (
  <>
    {/* Hero */}
    <div style={{ padding: '96px 40px 40px', maxWidth: 740 }}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)', marginBottom: 24 }}>For small & mid-size law firms — 2 to 20 attorneys</p>
      <h1 style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 20 }}>
        You didn't go to law school to chase paperwork and return status calls.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: 14, maxWidth: 620 }}>
        Replikte builds AI systems that run inside your firm — handling client communication between hearings, intake follow-up, deadline tracking, document chasing, and the coordination work that currently eats the hours you should be billing.
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-tertiary)', marginBottom: 32, maxWidth: 580 }}>
        Not a case management software you have to maintain. Not a virtual paralegal you have to manage. A system that works every matter, every day, and keeps working when your most organized person is out sick.
      </p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="https://calendly.com/replikte/30min" target="_blank" rel="noopener"
          style={{ fontSize: 14, fontWeight: 500, background: 'var(--color-ink)',
          color: 'var(--color-canvas)', borderRadius: 'var(--radius-md)', padding: '12px 22px', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Book a 30-minute conversation</a>
        <a href="#how" style={{ fontSize: 14, fontWeight: 500, background: 'transparent',
          color: 'var(--color-text-primary)', border: '0.5px solid var(--color-line)',
          borderRadius: 'var(--radius-md)', padding: '11px 20px', textDecoration: 'none' }}
          onMouseEnter={e => e.target.style.background = 'var(--color-paper)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >See how it works</a>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 4 }}>No pitch deck. No demo.</span>
      </div>
    </div>

    {/* Practice pills */}
    <div style={{ padding: '24px 40px 0' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {LAW_PILLS.map(p => (
          <span key={p} style={{ background: 'var(--color-paper)', borderRadius: 'var(--radius-sm)',
            padding: '5px 12px', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{p}</span>
        ))}
      </div>
    </div>

    <ProofBand label="What law firm clients stop losing" stats={PROOF_LAW} />

    <Section tinted>
      <SectionLabel>What stops happening when you work with us</SectionLabel>
      {SCENES_LAW.map((s, i) => <Scene key={i} {...s} />)}
    </Section>

    <WideSection>
      <SectionLabel>The stakes are different in law</SectionLabel>
      <div style={{ borderLeft: '3px solid #A32D2D', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
        background: 'var(--color-canvas)', borderTop: '0.5px solid var(--color-line)',
        borderRight: '0.5px solid var(--color-line)', borderBottom: '0.5px solid var(--color-line)',
        padding: '28px 32px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>In most businesses, a dropped ball costs money. In a law firm, it can cost a career.</h3>
        <Body>A missed statute of limitations. A filing deadline that slipped. A client who felt ignored long enough to file a bar complaint. These aren't hypotheticals — they're the outcomes that end practices.</Body>
        <Body><strong>The attorneys who lose their licenses rarely lose them for bad legal work.</strong> They lose them for the things that fall through the cracks when a small firm is running on memory, goodwill, and whoever happens to be in the office that day.</Body>
        <Body style={{ marginBottom: 0 }}>What we build removes that exposure. Not because we practice law — we don't touch the legal work — but because <strong>the system that tracks your deadlines doesn't have bad weeks, doesn't forget, and doesn't call in sick the day before a filing is due.</strong></Body>
      </div>
      <div style={{ background: 'var(--color-paper)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <strong>On confidentiality:</strong> We work within your existing tools and protocols. No client data sits in third-party AI systems without your explicit review and approval. We treat attorney-client privilege the same way you do — as non-negotiable.
        </p>
      </div>
    </WideSection>

    <Section tinted id="pricing">
      <SectionLabel>How we work with you — fixed monthly, no surprises</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {TIERS_LAW.map((t, i) => <TierCard key={i} tier={t} featured={i === 1} />)}
      </div>
    </Section>

    <Section id="how">
      <SectionLabel>How it starts</SectionLabel>
      <ProcessList steps={PROCESS_LAW} />
    </Section>

    <FinalBand
      headline="One conversation. No pitch deck."
      body="Tell us your biggest operational headache — intake, client communication, deadlines, document collection — and we'll tell you honestly what we'd build and what you'd expect to get back."
      cta="Start the conversation"
      meta="contact@replikte.com"
    />
  </>
);

Object.assign(window, { PageLaw });
