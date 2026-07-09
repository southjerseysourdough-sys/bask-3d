// Testimonials, tokenized until the client supplies real quotes. Room for
// three. Every quote and attribution is a placeholder, nothing invented.

type Quote = {
  body: string;
  name: string;
  handle: string;
};

const QUOTES: Quote[] = [
  {
    body: "[[NEEDS INPUT: testimonial 1, one or two sentences]]",
    name: "[[NEEDS INPUT: name]]",
    handle: "[[NEEDS INPUT: business]]",
  },
  {
    body: "[[NEEDS INPUT: testimonial 2, one or two sentences]]",
    name: "[[NEEDS INPUT: name]]",
    handle: "[[NEEDS INPUT: business]]",
  },
  {
    body: "[[NEEDS INPUT: testimonial 3, optional]]",
    name: "[[NEEDS INPUT: name]]",
    handle: "[[NEEDS INPUT: business]]",
  },
];

export function Testimonials() {
  return (
    <div className="quote-grid">
      {QUOTES.map((q, i) => (
        <figure className="quote-card" key={i}>
          <div className="quote-head">
            <span className="avatar" aria-hidden="true" />
            <div>
              <div className="quote-name needs-input">{q.name}</div>
              <div className="quote-handle needs-input">{q.handle}</div>
            </div>
          </div>
          <blockquote>
            <p className="needs-input">{q.body}</p>
          </blockquote>
        </figure>
      ))}
    </div>
  );
}
