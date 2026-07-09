import SignatureScene from "@/components/SignatureScene";
import StarField from "@/components/StarField";
import { BookButton } from "@/components/BookButton";
import { Testimonials } from "@/components/Testimonials";
import {
  IconSparkle,
  IconChevronRight,
  IconMonitoring,
  IconUpdates,
  IconEndpoints,
  IconBackups,
} from "@/components/icons";

export default function Home() {
  return (
    <>
      {/* Fixed signature graphic (Signal Weave), behind everything, reads scroll but never traps it. */}
      <div className="scene-bg" aria-hidden="true">
        <SignatureScene />
      </div>
      {/* Decorative constellation, above the void, below content. */}
      <StarField />

      <div className="page">
        <div className="nav-wrap">
          <nav className="nav-pill">
            <div className="logo">
              bask<span>FOR BUSINESS</span>
            </div>
            <div className="navlinks">
              <a href="#paths">Support levels</a>
              <a href="#pricing">Pricing</a>
              <a href="#handle">What we handle</a>
            </div>
            <BookButton compact />
          </nav>
        </div>

        <main>
          {/* Task 1 and 7: live hero text, one real h1, one primary CTA, one quiet secondary link. */}
          <section className="section hero" id="top">
            <div className="container hero-inner">
              <span className="badge-pill">
                <IconSparkle size={15} />
                Managed IT, plain and simple
              </span>
              <h1>
                Managed IT and helpdesk support for small businesses that need{" "}
                <span className="grad-text">fewer surprises</span>.
              </h1>
              <p className="sub">
                One team handling day to day support and the systems behind it,
                at a fixed monthly fee. No jargon, no surprise invoices, no
                chasing three different vendors.
              </p>
              <div className="cta-row">
                <BookButton />
                <a className="btn-secondary" href="#paths">
                  See how it works
                </a>
              </div>
              <div className="scrolltip">Scroll to see how we work</div>
            </div>
          </section>

          {/* Task 2: proof, figures and quotes tokenized. */}
          <section className="section" id="proof">
            <div className="container">
              <div className="section-head">
                <span className="badge-pill">
                  <IconSparkle size={15} />
                  Proof, not promises
                </span>
                <h2>The kind of numbers a buyer actually wants to see.</h2>
              </div>
              <div className="proof-grid">
                <div className="stat">
                  <div className="stat-num needs-input">
                    [[NEEDS INPUT: years in business]]
                  </div>
                  <div className="stat-label">Years in business</div>
                </div>
                <div className="stat">
                  <div className="stat-num needs-input">
                    [[NEEDS INPUT: businesses supported]]
                  </div>
                  <div className="stat-label">Businesses supported</div>
                </div>
                <div className="stat">
                  <div className="stat-num needs-input">
                    [[NEEDS INPUT: average response time]]
                  </div>
                  <div className="stat-label">Average response time</div>
                </div>
                <div className="stat">
                  <div className="stat-num needs-input">
                    [[NEEDS INPUT: resolution rate]]
                  </div>
                  <div className="stat-label">Resolution rate</div>
                </div>
              </div>
              <div className="badge-row">
                <span className="badge-chip">Works with GoDaddy</span>
                <span className="badge-chip">
                  Powered by Nano Heal monitoring
                </span>
                <span className="badge-chip tokened">
                  [[NEEDS INPUT: additional partner or certification badge]]
                </span>
                <span className="badge-note">
                  Partner names shown as text until logo usage rights are
                  confirmed. [[NEEDS INPUT: confirm GoDaddy and Nano Heal logo
                  usage rights]]
                </span>
              </div>
            </div>
          </section>

          {/* Task 5: two path section, SMB helpdesk vs SMB+ full MSP, Nano Heal named. */}
          <section className="section" id="paths">
            <div className="container">
              <div className="section-head">
                <span className="badge-pill">
                  <IconSparkle size={15} />
                  Two lanes, one team
                </span>
                <h2>Pick the lane that matches how your team actually works.</h2>
              </div>
              <div className="path-grid">
                <div className="path-card">
                  <span className="path-tier">SMB · Core Support</span>
                  <h3>Helpdesk, when you need it.</h3>
                  <p>
                    Your team reaches a real person for day to day issues, from a
                    stuck laptop to a locked account. Reactive support, fast,
                    without a long term commitment to a full managed plan.
                  </p>
                  <p className="meta">The SMB helpdesk tier.</p>
                  <a className="chev-link" href="#book">
                    See Core Support
                    <IconChevronRight size={16} />
                  </a>
                </div>
                <div className="path-card">
                  <span className="path-tier">SMB+ · Managed IT</span>
                  <h3>One team owns the whole environment.</h3>
                  <p>
                    Nano Heal watches your systems around the clock and fixes
                    what it can before you notice. Proactive monitoring, patching,
                    and one point of contact for everything.
                  </p>
                  <p className="meta">
                    The SMB+ full MSP tier, with proactive monitoring powered by
                    Nano Heal.
                  </p>
                  <a className="chev-link" href="#book">
                    See Managed IT
                    <IconChevronRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Task 3: pricing and objections. Fixed monthly fee, no surprise call out charges. */}
          <section className="section" id="pricing">
            <div className="container">
              <div className="section-head">
                <span className="badge-pill">
                  <IconSparkle size={15} />
                  Cost and commitment
                </span>
                <h2>
                  Straight answers to the three questions everyone actually has.
                </h2>
              </div>
              <div className="price-grid">
                <div className="price-main">
                  <div className="price-kicker">What it costs</div>
                  <div className="amt needs-input">
                    [[NEEDS INPUT: price or range]]
                  </div>
                  <p>
                    A fixed monthly fee. No surprise call out charges, so you can
                    budget around it instead of bracing for it.
                  </p>
                </div>
                <div className="price-side">
                  <h4>Are we locked into a long contract?</h4>
                  <p className="needs-input">
                    [[NEEDS INPUT: contract terms, one or two plain sentences once
                    confirmed]]
                  </p>
                </div>
                <div className="price-side">
                  <h4>What happens when we switch to you?</h4>
                  <p>
                    Onboarding is handled end to end. We map your systems first,
                    so nothing gets missed and nothing breaks on day one.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Task 6: what we handle, concrete thing plus payoff, Nano Heal attributed. */}
          <section className="section" id="handle">
            <div className="container">
              <hr className="aurora" />
              <div className="section-head" style={{ marginTop: "clamp(56px, 8vw, 96px)" }}>
                <span className="badge-pill">
                  <IconSparkle size={15} />
                  What we handle
                </span>
                <h2>Named tools, named work, no filler.</h2>
              </div>
              <div className="handle-grid">
                <div className="feature">
                  <div className="icon">
                    <IconMonitoring />
                  </div>
                  <h4>Monitoring</h4>
                  <p>
                    Nano Heal watches your endpoints around the clock and flags
                    trouble before it turns into downtime, so issues get solved
                    on our screens, not on your desk.
                  </p>
                </div>
                <div className="feature">
                  <div className="icon">
                    <IconUpdates />
                  </div>
                  <h4>Updates and patching</h4>
                  <p>
                    Security patches and version updates ship on a set schedule,
                    tracked per device, not whenever someone happens to remember.
                  </p>
                </div>
                <div className="feature">
                  <div className="icon">
                    <IconEndpoints />
                  </div>
                  <h4>Endpoint support</h4>
                  <p>
                    Every laptop, desktop, and device your team touches sits in
                    one ticket queue with one help desk, so nobody is left
                    guessing who to call.
                  </p>
                </div>
                <div className="feature">
                  <div className="icon">
                    <IconBackups />
                  </div>
                  <h4>Backups</h4>
                  <p>
                    Your data is backed up and the restore is actually tested, so
                    recovery is something we have proven, not something we hope
                    works.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Task 2 continued: testimonials, tokenized. */}
          <section className="section" id="testimonials">
            <div className="container">
              <div className="section-head">
                <span className="badge-pill">
                  <IconSparkle size={15} />
                  In their words
                </span>
                <h2>What running with Bask actually feels like.</h2>
              </div>
              <Testimonials />
            </div>
          </section>

          {/* Task 4: single primary CTA repeated, pointed at the booking flow. */}
          <section className="section final-cta" id="book">
            <div className="container final-inner">
              <hr className="aurora" />
              <h2>One team. Fewer surprises. A clear next step.</h2>
              <div className="cta-row">
                <BookButton />
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container">
            Bask For Business. Managed IT and helpdesk support for small
            businesses. [[NEEDS INPUT: contact email and phone]]
          </div>
        </footer>
      </div>
    </>
  );
}
