// PageAbout.jsx

const PageAbout = ({ onNavigate }) => (
  <>
    {/* Hero */}
    <div style={{ padding: '96px 40px 80px', maxWidth: 740 }}>
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)', marginBottom: 24 }}>About replikte</p>
      <h1 style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 20 }}>
        We build the nervous system that runs the business around the business.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: 620 }}>
        The follow-ups, the reminders, the status updates, the document chasing, the scheduling coordination — everything that holds a real operation together but has nothing to do with the actual craft. We build AI systems that handle all of it, and we run them permanently.
      </p>
    </div>

    {/* Manifesto */}
    <Section>
      <SectionLabel>What we believe</SectionLabel>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.85,
        color: 'var(--color-text-primary)', maxWidth: 640 }}>
        <p style={{ marginBottom: 24 }}>Most small businesses in this country were built by people who are extraordinarily good at something — building, fixing, practicing, serving. They built something real. And then the business got complex enough that a second job appeared alongside the first one: managing everything around the work.</p>
        <p style={{ marginBottom: 24 }}>The follow-up that didn't go out. The status call that took 20 minutes to answer. The estimate that sat for two weeks while the customer went elsewhere. The document that stalled a case because nobody remembered to chase it. These aren't failures of skill or ambition. They're the tax that every small business pays for not having an operations team.</p>
        <p style={{ marginBottom: 24 }}>For decades, the only answer was to hire more people. And for a 200-person company, that works. For a 15-person contractor or a 4-attorney firm, it doesn't — the margin isn't there, the management overhead is real, and the institutional knowledge walks out the door when someone quits.</p>
        <p style={{ marginBottom: 24 }}>Replikte exists because that trade-off is no longer necessary.</p>
        <p style={{ marginBottom: 24 }}>We build AI systems that run the operational layer of small businesses permanently — the coordination, the communication, the follow-through — so the people who built the business can get back to the work that actually requires them.</p>
        <p style={{ marginBottom: 24 }}>We don't sell software. We don't give advice and leave. We install intelligence directly into how a business runs, and we keep it running. Month after month. Getting better as it learns the operation. Never having a bad week.</p>
        <p style={{ marginBottom: 0 }}>The businesses we work with don't talk about AI. They talk about the problem that finally stopped happening.</p>
      </div>
    </Section>

    {/* How we're different */}
    <Section tinted>
      <div style={{ maxWidth: 640 }}>
        <SectionLabel>How we're different</SectionLabel>
        <h3 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 20 }}>We're not a consultant. We're not software. We're not a staffing agency.</h3>
        {[
          { label: 'We don\'t advise — we install and stay.', body: 'A consultant diagnoses, writes a report, and leaves. We diagnose, build the system, and keep it running permanently. The operation keeps working because we\'re still running it.' },
          { label: 'We don\'t sell a tool — we sell a result.', body: 'Software is a database that waits for someone to open it. Our systems act without being asked, every day, whether the office is busy or quiet.' },
          { label: 'We don\'t provide labor — we provide leverage.', body: 'An offshore VA team depends on the person assigned to your account this month. Our system doesn\'t have bad weeks, doesn\'t quit, and gets smarter the longer it runs.' },
          { label: 'We speak your industry.', body: 'We work with construction companies, home service businesses, and law firms. We know what a punch list is, what a maintenance agreement means, and why a missed statute of limitations is different from a missed deadline.' },
        ].map((item, i) => (
          <Body key={i}><strong>{item.label}</strong> {item.body}</Body>
        ))}
      </div>
    </Section>

    {/* Industries */}
    <Section>
      <div style={{ maxWidth: 640 }}>
        <SectionLabel>The industries we serve</SectionLabel>
        <h3 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 12 }}>We go deep, not wide.</h3>
        <Body>We could try to serve every business. Instead, we chose three industries where the pattern is strongest — where a highly skilled person is doing low-value admin work because no one else can, and where the operational chaos has real financial consequences.</Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
          {[
            { tag: 'Construction & contracting', title: 'Things stop falling through the cracks.', body: 'Subs, change orders, compliance docs, billing, client updates — handled without you holding it all together.', page: 'construction' },
            { tag: 'Home services & trades', title: 'Slow season becomes optional.', body: 'Estimates followed up, maintenance customers reactivated, reviews captured — your customer base working year-round.', page: 'trades' },
            { tag: 'Small & mid-size law firms', title: 'The status calls stop coming in.', body: 'Intake, client communication, deadline tracking, document chasing — running without depending on whoever remembers to do it.', page: 'law' },
          ].map(item => (
            <div key={item.page} style={{ padding: 24, border: '0.5px solid var(--color-line)',
              borderRadius: 'var(--radius-lg)', background: 'var(--color-canvas)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)', marginBottom: 8 }}>{item.tag}</p>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{item.title}</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>{item.body}</p>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate(item.page); }}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-signal)', textDecoration: 'none' }}>See the page →</a>
            </div>
          ))}
        </div>
      </div>
    </Section>

    {/* Location */}
    <Section tinted>
      <div style={{ maxWidth: 640 }}>
        <SectionLabel>Where to find us</SectionLabel>
        <Body>Replikte LLC is based in Boca Raton, Florida. We work with clients across the United States.</Body>
        <Body>For new business inquiries: <a href="mailto:contact@replikte.com" style={{ color: 'var(--color-signal)', textDecoration: 'none', fontWeight: 500 }}>contact@replikte.com</a></Body>
      </div>
    </Section>

    <FinalBand
      headline={"Start with one question:\nwhat keeps falling apart?"}
      body="Tell us the one thing in your operation that keeps breaking down. We'll tell you honestly whether we can fix it, and what it would look like if we did."
      cta="Start the conversation"
    />
  </>
);

Object.assign(window, { PageAbout });
