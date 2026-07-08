// Testimonials, tokenized until the client supplies real quotes. Room for two
// or three. Every quote and attribution is a placeholder, nothing invented.

type Quote = {
  body: string;
  attribution: string;
};

const QUOTES: Quote[] = [
  {
    body: "[[NEEDS INPUT: testimonial 1, one or two sentences]]",
    attribution: "[[NEEDS INPUT: name, business]]",
  },
  {
    body: "[[NEEDS INPUT: testimonial 2, one or two sentences]]",
    attribution: "[[NEEDS INPUT: name, business]]",
  },
  {
    body: "[[NEEDS INPUT: testimonial 3, optional]]",
    attribution: "[[NEEDS INPUT: name, business]]",
  },
];

export function Testimonials() {
  return (
    <div className="quote-grid">
      {QUOTES.map((q, i) => (
        <figure className="quote-card" key={i}>
          <blockquote>
            <p className="needs-input">{q.body}</p>
          </blockquote>
          <figcaption className="quote-attr needs-input">
            {q.attribution}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
