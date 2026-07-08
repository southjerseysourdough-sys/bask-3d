// The one and only primary call to action. Same label everywhere, pointed at
// the consultation booking flow. Everything else on the page is a secondary
// text link, never a competing button.

export const CTA_LABEL = "Book a 15 minute IT assessment";

// The live booking widget is not wired up in this repo yet, so the destination
// is a placeholder anchor. Replace with the real consultation booking URL.
// [[NEEDS INPUT: consultation booking widget URL or embed]]
export const BOOKING_HREF = "#book";

export function BookButton({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const classes = ["btn-primary", compact ? "compact" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <a href={BOOKING_HREF} className={classes}>
      {CTA_LABEL}
    </a>
  );
}
