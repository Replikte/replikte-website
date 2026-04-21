// PageTrades.jsx

const PROOF_TRADES = [
  { value: '60–70%', label: 'of unsent or unfollowed estimates never become jobs — most from simple non-response' },
  { value: '$12k+', label: 'avg. annual revenue per maintenance agreement customer vs one-time job' },
  { value: '1 in 3', label: 'happy customers would leave a review if someone simply asked at the right moment' },
  { value: 'Slow season', label: 'is optional — for companies with a system that works their customer base year-round' },
];

const SCENES_TRADES = [
  { tag: 'Estimates & follow-up', before: '"I sent out nine estimates last week. I\'ve heard back from two. I know I should follow up but I\'ve been slammed — by the time I get to it, they\'ve called someone else."', after: 'Every estimate triggers an automatic follow-up sequence — a check-in at 48 hours, a nudge at day five, a final reach-out at day ten. You find out they went elsewhere, or you win the job.' },
  { tag: 'Maintenance agreements & recurring revenue', before: '"We serviced that AC unit two summers ago. Never heard from them again. That\'s probably a $600 tune-up every year, plus whatever breaks."', after: 'Every completed job becomes a managed relationship. Service reminders go out at the right time of year, automatically. Slow season fills up with customers who were already yours.' },
  { tag: 'Scheduling & dispatch coordination', before: '"A tech called in sick at 6:45am. I spent two hours rescheduling six appointments, calling customers, and shuffling trucks."', after: 'Rescheduling triggers go out to affected customers automatically with new time options. Techs get updated routes before they leave the house.' },
  { tag: 'Google reviews & reputation', before: '"We do great work. Our reviews don\'t show it. I always forget to ask, and the moment passes."', after: 'Review requests go out automatically one hour after a job closes — when the customer is standing in a cool house or watching the drain flow freely. Right moment, every time.' },
  { tag: 'Customer history & callbacks', before: '"My best tech left last year and half our customer knowledge left with him — it was all in his head."', after: 'Every job, every note, every part installed — all in one place, tied to the customer. The business stops depending on one person\'s memory.' },
  { tag: 'Slow season — the real problem', before: '"October hits and the phones go quiet. Every year I say I\'m going to build up maintenance agreements. Every year I\'m too busy in summer."', after: 'Your existing customer base becomes your slow-season pipeline. Fall tune-up campaigns, annual inspection reminders — all running automatically from the jobs you already did.' },
];

const TIERS_TRADES = [
  { name: 'Foundations', price: '$1,200', sub: 'Fix the one leak costing you most',
    features: ['2-week ops audit', 'One AI workflow — estimates, maintenance, or reviews', 'We run it, you don\'t manage it', 'Monthly review & tuning'],
    note: 'Good starting point for owners who want to see results before going deeper' },
  { name: 'Full revenue ops', price: '$2,800', sub: 'Estimates, maintenance, reviews, scheduling — all of it running',
    features: ['4-week audit of your full customer & job flow', 'Estimate follow-up, maintenance outreach, reviews', 'Scheduling coordination & rescheduling', 'Customer history — all in one place', 'Bi-weekly reviews & continuous tuning'],
    note: 'Most owners see ROI in the first 30 days' },
  { name: 'Growth partner', price: '$5,500', sub: 'Built to scale your operation',
    features: ['Everything in Full revenue ops', 'Seasonal campaign planning & execution', 'Multi-location or multi-crew coordination', 'New service line launch support', 'Weekly strategic sessions'],
    note: 'For owners actively growing — more trucks, more crews, new services' },
];

const PROCESS_TRADES = [
  { title: 'We look at your customer base and job history (weeks 1–2)', body: 'We go through your tickets, your estimates, your completed jobs. We find out exactly how much revenue is sitting in your existing customer base uncollected.', ai: 'This is how our system gets trained on your customers specifically — their service history, their equipment, their timing.' },
  { title: 'We show you the number (week 3)', body: 'We put a dollar figure on what\'s leaking — open estimates, lapsed maintenance customers, missed referrals. You decide what to go after first.' },
  { title: 'We build and activate (weeks 4–6)', body: 'The AI workflows go live connected to the tools your team already uses. Nothing new to learn. It just starts running.', ai: 'Your techs don\'t change how they work. Customers just start hearing from you at the right times.' },
  { title: 'We run it, permanently (month 2 onward)', body: 'Monthly retainer. We monitor, tune, and expand. Slow season outreach gets planned in August so it\'s ready in October.', ai: 'Every job adds to the customer history the system works from.' },
];

const TRADES_PILLS = ['HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Landscaping', 'Pest control', 'Painting', 'Flooring'];

const PageTrades = () => (
  <>
    {/* Hero */}
    <div style={{ padding: '96px 40px 40px', maxWidth: 740 }}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)', marginBottom: 24 }}>For HVAC, plumbing, electrical, roofing & trades — 3 to 40 technicians</p>
      <h1 style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 20 }}>
        You're booked solid in summer. And somehow still leaving money on the table.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: 14, maxWidth: 620 }}>
        Replikte builds AI systems that run inside your trades business — following up on open estimates, filling your slow season with maintenance calls, turning one-time customers into recurring ones, and handling the scheduling coordination that currently depends on whoever answers the phone.
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-tertiary)', marginBottom: 32, maxWidth: 580 }}>
        Not a new dispatch software. Not a call center. A system that works every day, knows your customer history, and keeps the revenue engine running whether it's your busiest week or your slowest.
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

    {/* Trades pills */}
    <div style={{ padding: '24px 40px 0' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TRADES_PILLS.map(p => (
          <span key={p} style={{ background: 'var(--color-paper)', borderRadius: 'var(--radius-sm)',
            padding: '5px 12px', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{p}</span>
        ))}
      </div>
    </div>

    <ProofBand label="What trades clients stop losing" stats={PROOF_TRADES} />

    <Section tinted>
      <SectionLabel>What stops happening — and what starts</SectionLabel>
      {SCENES_TRADES.map((s, i) => <Scene key={i} {...s} />)}
    </Section>

    <WideSection>
      <SectionLabel>The money that's already yours — just uncollected</SectionLabel>
      <div style={{ background: 'var(--color-paper)', borderRadius: 'var(--radius-lg)', padding: '32px 36px' }}>
        <h3 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 12 }}>Most trades companies are sitting on a revenue stream they built and then walked away from.</h3>
        <Body>Every completed job is a future customer. Every satisfied homeowner is a referral waiting to be asked. The work to capture this revenue isn't finding new customers — it's staying in touch with the ones you already won.</Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 20 }}>
          {[
            { amount: '+$800–2,400', label: 'per recovered estimate — jobs won from follow-ups that would have gone silent' },
            { amount: '+$600–1,200', label: 'per reactivated maintenance customer — annual value of a recurring agreement' },
            { amount: '+$200–500', label: 'per referred job — from one ask at the right moment' },
            { amount: '10–15 hrs', label: 'per week returned to the owner — scheduling, follow-ups, callbacks' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'var(--color-canvas)', border: '0.5px solid var(--color-line)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
              <p style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{item.amount}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </WideSection>

    <Section tinted id="pricing">
      <SectionLabel>How we work with you — fixed monthly, no surprises</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {TIERS_TRADES.map((t, i) => <TierCard key={i} tier={t} featured={i === 1} />)}
      </div>
    </Section>

    <Section tinted={false} id="how">
      <SectionLabel>How it starts</SectionLabel>
      <ProcessList steps={PROCESS_TRADES} />
    </Section>

    <FinalBand
      headline="Start with one question."
      body="How many estimates did you send in the last 60 days that you never followed up on? Whatever that number is — that's the first thing we fix."
      cta="Start the conversation"
      meta="contact@replikte.com"
    />
  </>
);

Object.assign(window, { PageTrades });
