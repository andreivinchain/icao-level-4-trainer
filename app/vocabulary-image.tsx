type VocabularyImageProps = {
  unit: string;
  index: number;
  alt: string;
  className?: string;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function VocabularyImage({ unit, index, alt, className = "" }: VocabularyImageProps) {
  const numericUnit = Number(unit);
  const layout = numericUnit <= 5 ? "grid-2" : [11, 12, 13, 15, 23, 24, 25, 28].includes(numericUnit) ? "grid-4" : "grid-4-wide";
  const columns = layout === "grid-2" ? 2 : 4;
  const rows = layout === "grid-2" ? 4 : 2;
  const x = (index % columns) * (100 / (columns - 1));
  const y = Math.floor(index / columns) * (100 / (rows - 1));

  return <div
    className={`vocabulary-image ${layout} ${className}`.trim()}
    role="img"
    aria-label={alt}
    style={{
      backgroundImage: `url(${basePath}/vocabulary/unit-${unit}.webp)`,
      backgroundPosition: `${x}% ${y}%`,
    }}
  />;
}
