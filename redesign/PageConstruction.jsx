// PageConstruction.jsx

const PROOF_CONSTRUCTION = [
  { value: '~14 hrs', label: 'avg. hours/week owners spend on ops admin instead of building' },
  { value: '6–9%', label: 'of contract value lost to undocumented change orders and billing gaps' },
  { value: 'Day 1', label: 'when our system starts running inside your business — no long rollout' },
  { value: '24/7', label: 'the system works — not just during office hours' },
];

const SCENES_CONSTRUCTION = [
  { tag: 'Subcontractor coordination', before: '"I\'ve called Rodriguez three times. Nobody knows if his crew is showing up Tuesday or not."', after: 'Confirmation requests go out automatically 72 hours before. No-shows surface Monday morning, not Tuesday at 6am. You make one call — to rebook, not to chase.' },
  { tag: 'Change orders', before: '"We talked about it on-site. Now they\'re saying they never approved it and they\'re not paying the extra $8,000."', after: 'Every scope change gets documented and sent for signature the same day it\'s discussed. Nothing verbal, nothing lost, nothing disputed at invoice time.' },
  { tag: 'Bid preparation', before: '"I spent all Sunday on that bid. Still not confident I got the material costs right. Lost it anyway."', after: 'Bid packages assembled from your past jobs and current pricing. Scope gaps flagged before you submit. Sunday stays yours.' },
  { tag: 'Client status & communication', before: '"A client called at 7am asking where things stood. I had to call my foreman, who had to call his guy. Took 40 minutes to answer a simple question."', after: 'Job status is current, always. Clients get a weekly update automatically. You answer the 7am call in 10 seconds — or they never need to make it.' },
  { tag: 'Compliance & documentation', before: '"We\'re waiting on an insurance cert from a sub. Three days now. It\'s holding up the whole job start."', after: 'Certs, lien waivers, safety docs — tracked, requested, and chased automatically until received. Nothing stalls because a piece of paper is missing.' },
  { tag: 'Invoicing & billing', before: '"End of month billing took two of us three days. We still missed some reimbursables. Cash flow is always tight because invoices go out late."', after: 'Invoices built from job records, hours, and materials the day work closes. Nothing missed. Cash flow improves because billing stops being the bottleneck.' },
];

const TIERS_CONSTRUCTION = [
  { name: 'Foundations', price: '$1,500', sub: 'One critical problem, solved permanently',
    features: ['2-week ops audit', 'One AI workflow built & live', 'We run it, you don\'t manage it', 'Monthly review & tuning'],
    note: 'Good for owners who want to see it work before going deeper' },
  { name: 'Full operations', price: '$3,500', sub: 'The whole back office running without you holding it together',
    features: ['4-week deep ops audit', 'Subs, change orders, docs, billing — all of it', 'AI workflows connected across your jobs', 'Bi-weekly reviews & continuous tuning', 'Dedicated Replikte contact'],
    note: 'The system learns your operation month over month — it gets better, not stale' },
  { name: 'Growth partner', price: '$7,000', sub: 'Built to scale as you take on more work',
    features: ['Everything in Full operations', 'Bid intelligence & competitor pricing signals', 'Custom workflows as your jobs grow', 'Weekly strategic sessions', 'New AI capabilities as they emerge'],
    note: 'For owners ready to grow without the ops chaos that usually comes with it' },
];

const PROCESS_CONSTRUCTION = [
  { title: 'We walk your operation (weeks 1–2)', body: 'We study your bids, your job flow, your tools, your team communication — the way a new COO would in their first two weeks. We\'re not selling you a template. We\'re learning how your business actually runs.', ai: 'This is how our system gets trained on your operation specifically — not on construction in general.' },
  { title: 'We show you exactly where time and money are leaking (week 3)', body: 'We map the 3–5 places in your operation where things are falling through the cracks — and what each one is actually costing you. You decide what to fix first.' },
  { title: 'We build and activate (weeks 4–6)', body: 'The AI workflows go live inside the tools your team already uses. No new software to learn. No training sessions. It just starts working.', ai: 'Your team doesn\'t interact with "AI." They just notice things stop getting dropped.' },
  { title: 'We run it, permanently (month 2 onward)', body: 'You pay the monthly retainer. We monitor, tune, and expand. As your jobs grow or change, the system adapts. You don\'t manage it — that\'s the point.', ai: 'What we build in month one works better in month six. The system learns as it runs.' },
];

const PageConstruction = ({ onNavigate }) => (
  <>
    {/* Hero */}
    <div style={{ padding: '96px 40px 80px', maxWidth: 740 }}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)', marginBottom: 24 }}>For construction & contracting companies — 15 to 60 people</p>
      <h1 style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 20 }}>
        You're running a construction company. You shouldn't also be running a paper chase.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: 14, maxWidth: 620 }}>
        Somewhere between managing subs, chasing signed change orders, and figuring out why job 7 is two weeks behind, the actual business — bidding, building, growing — gets pushed to the weekend. Replikte fixes the operational stuff that keeps falling through the cracks.
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-tertiary)', marginBottom: 32, maxWidth: 580 }}>
        Not a new software tool. Not a consultant who leaves. A system that works every day, learns how your jobs run, and keeps working whether you're on-site or not.
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

    <ProofBand label="What construction clients stop losing" stats={PROOF_CONSTRUCTION} />

    <Section tinted>
      <SectionLabel>What stops happening when you work with us</SectionLabel>
      {SCENES_CONSTRUCTION.map((s, i) => <Scene key={i} {...s} />)}
    </Section>

    <WideSection>
      <SectionLabel>Why this is different from everything else you've tried</SectionLabel>
      <div style={{ background: 'var(--color-paper)', borderRadius: 'var(--radius-lg)', padding: '32px 36px' }}>
        <h3 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 16 }}>Most solutions fix the problem once. This one keeps it fixed.</h3>
        <Body>You've probably tried software that required training nobody did. Or brought in a consultant who gave you a plan and left. Or hired someone who handled it well until they quit.</Body>
        <Body>What we build is different because <strong>it isn't a person and it isn't a tool you manage</strong> — it's an AI system that runs inside your operation continuously. It follows up on things automatically. It notices when something is late before you do.</Body>
        <Body style={{ marginBottom: 0 }}><strong>A good operations manager costs $85,000 a year, takes three months to learn your business, and eventually leaves.</strong> Our system is trained on how construction businesses run, is inside yours within weeks, and keeps getting better the longer it's there.</Body>
      </div>
    </WideSection>

    <Section tinted id="pricing">
      <SectionLabel>How we work with you — fixed monthly, no surprises</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {TIERS_CONSTRUCTION.map((t, i) => <TierCard key={i} tier={t} featured={i === 1} />)}
      </div>
    </Section>

    <Section id="how">
      <SectionLabel>How it starts</SectionLabel>
      <ProcessList steps={PROCESS_CONSTRUCTION} />
    </Section>

    <FinalBand
      headline="Start with a 30-minute conversation."
      body="Tell us the one thing in your operation that keeps falling apart. We'll tell you honestly whether we can fix it — and what it would look like if we did. No pitch deck, no demo. Just a straight conversation about your business."
      cta="Start the conversation"
      meta="contact@replikte.com"
    />
  </>
);

Object.assign(window, { PageConstruction });
