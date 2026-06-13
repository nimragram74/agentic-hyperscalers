export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 font-body text-base leading-relaxed text-ink-300 ${
            align === "center" ? "mx-auto max-w-xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
