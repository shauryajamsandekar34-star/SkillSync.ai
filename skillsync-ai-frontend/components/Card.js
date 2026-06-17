export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-paper border border-ink/10 rounded-sm p-6 ${className}`}>
      {title ? (
        <h3 className="font-display text-base mb-3 text-ink">{title}</h3>
      ) : null}
      {children}
    </div>
  );
}
