import SignatureScene from "@/components/SignatureScene";
import { BookButton } from "@/components/BookButton";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      {/* Fixed signature graphic, behind all content, reads scroll but never traps it. */}
      <div className="scene-bg" aria-hidden="true">
        <SignatureScene />
      </div>

      <div className="page">
        <nav className="nav">
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

        {/* Task 1 and Task 7: live hero text, one real h1, one primary CTA, one quiet secondary link. */}
        <section className="section hero" id="top">
          <div className="eyebrow">Managed IT, plain and simple</div>
          <h1>
            Managed IT and helpdesk support for small businesses that need fewer
            surprises.
          </h1>
          <p className="sub">
            One team handling day to day support and the systems behind it, at a
            fixed monthly fee. No jargon, no surprise invoices, no chasing three
            different vendors.
          </p>
          <div className="cta-row">
            <BookButton />
            <a className="btn-secondary" href="#paths">
              See how it works
            </a>
          </div>
          <div className="scrolltip">Scroll to see how we work</div>
        </section>

        {/* Task 2: proof strip on the off white panel. Figures and quotes tokenized. */}
        <section className="section panel proof" id="proof">
          <div className="eyebrow">Proof, not promises</div>
          <h2 style={{ maxWidth: "20ch" }}>
            The kind of numbers a buyer actually wants to see.
          </h2>
          <div className="proof-grid">
            <div className="proof-stat">
              <div className="proof-num needs-input">
                [[NEEDS INPUT: years in business]]
              </div>
              <div className="proof-label">Years in business</div>
            </div>
            <div className="proof-stat">
              <div className="proof-num needs-input">
                [[NEEDS INPUT: businesses supported]]
              </div>
              <div className="proof-label">Businesses supported</div>
            </div>
            <div className="proof-stat">
              <div className="proof-num needs-input">
                [[NEEDS INPUT: average response time]]
              </div>
              <div className="proof-label">Average response time</div>
            </div>
            <div className="proof-stat">
              <div className="proof-num needs-input">
                [[NEEDS INPUT: resolution rate]]
              </div>
              <div className="proof-label">Resolution rate</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge">Works with GoDaddy</span>
            <span className="badge">Powered by Nano Heal monitoring</span>
            <span className="badge tokened">
              [[NEEDS INPUT: additional partner or certification badge]]
            </span>
            <span className="badge-note">
              Partner names shown as text until logo usage rights are confirmed.
              [[NEEDS INPUT: confirm GoDaddy and Nano Heal logo usage rights]]
            </span>
          </div>
        </section>

        {/* Task 5: two path section, SMB helpdesk vs SMB+ full MSP, Nano Heal named. */}
        <section className="section paths" id="paths">
          <div className="eyebrow">Two lanes, one team</div>
          <h2>Pick the lane that matches how your team actually works.</h2>
          <div className="path-grid">
            <div className="path-card">
              <div className="path-tier">SMB · Core Support</div>
              <h3>Helpdesk, when you need it.</h3>
              <p>
                Your team reaches a real person for day to day issues, from a
                stuck laptop to a locked account. Reactive support, fast, without
                a long term commitment to a full managed plan.
              </p>
              <p className="meta">The SMB helpdesk tier.</p>
              <a className="path-link" href="#book">
                See Core Support
              </a>
            </div>
            <div className="path-card">
              <div className="path-tier">SMB+ · Managed IT</div>
              <h3>One team owns the whole environment.</h3>
              <p>
                Nano Heal watches your systems around the clock and fixes what it
                can before you notice. Proactive monitoring, patching, and one
                point of contact for everything.
              </p>
              <p className="meta">
                The SMB+ full MSP tier, with proactive monitoring powered by Nano
                Heal.
              </p>
              <a className="path-link" href="#book">
                See Managed IT
              </a>
            </div>
          </div>
        </section>

        {/* Task 3: pricing and objections. Fixed monthly fee, no surprise call out charges. */}
        <section className="section pricing" id="pricing">
          <div className="eyebrow">Cost and commitment</div>
          <h2>Straight answers to the three questions everyone actually has.</h2>
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
                Onboarding is handled end to end. We map your systems first, so
                nothing gets missed and nothing breaks on day one.
              </p>
            </div>
          </div>
        </section>

        {/* Task 6: what we handle. Concrete thing plus concrete payoff, Nano Heal attributed. */}
        <section className="section handle" id="handle">
          <div className="eyebrow">What we handle</div>
          <h2>Named tools, named work, no filler.</h2>
          <div className="handle-grid">
            <div className="handle-card">
              <h4>Monitoring</h4>
              <p>
                Nano Heal watches your endpoints around the clock and flags
                trouble before it turns into downtime, so issues get solved on
                our screens, not on your desk.
              </p>
            </div>
            <div className="handle-card">
              <h4>Updates and patching</h4>
              <p>
                Security patches and version updates ship on a set schedule,
                tracked per device, not whenever someone happens to remember.
              </p>
            </div>
            <div className="handle-card">
              <h4>Endpoint support</h4>
              <p>
                Every laptop, desktop, and device your team touches sits in one
                ticket queue with one help desk, so nobody is left guessing who
                to call.
              </p>
            </div>
            <div className="handle-card">
              <h4>Backups</h4>
              <p>
                Your data is backed up and the restore is actually tested, so
                recovery is something we have proven, not something we hope
                works.
              </p>
            </div>
          </div>
        </section>

        {/* Task 2 continued: testimonials, tokenized. */}
        <section className="section panel" id="testimonials">
          <div className="eyebrow">In their words</div>
          <h2 style={{ maxWidth: "20ch" }}>
            What running with Bask actually feels like.
          </h2>
          <Testimonials />
        </section>

        {/* Task 4: single primary CTA repeated, pointed at the booking flow. */}
        <section className="section final-cta" id="book">
          <h2>One team. Fewer surprises. A clear next step.</h2>
          <div className="cta-row">
            <BookButton />
          </div>
        </section>

        <footer className="footer">
          <div>
            Bask For Business. Managed IT and helpdesk support for small
            businesses. [[NEEDS INPUT: contact email and phone]]
          </div>
        </footer>
      </div>
    </>
  );
}
