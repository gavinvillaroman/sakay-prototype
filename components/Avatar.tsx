import Image from "next/image";

type Props = {
  name: string;
  photo?: string;
  size?: number;
  className?: string;
};

// Treat placeholder URLs as "no real photo uploaded" → render the letter
// avatar so a host with no upload (e.g. SHOTCORNER CORP.) reads as
// intentional, not broken.
const isPlaceholderUrl = (url?: string) =>
  !url ||
  url.trim() === "" ||
  url.includes("pravatar.cc") ||
  url.includes("i.pravatar") ||
  url.includes("placeholder");

const initials = (name: string) => {
  const cleaned = name.replace(/[^A-Za-z\s]/g, "").trim();
  if (!cleaned) return "•";
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Avatar({ name, photo, size = 48, className = "" }: Props) {
  const showLetter = isPlaceholderUrl(photo);
  const px = `${size}px`;

  if (showLetter) {
    const initial = name.trim() ? name.trim()[0].toUpperCase() : "•";
    return (
      <div
        className={`rounded-full bg-accent text-accent-fg flex items-center justify-center font-semibold tracking-tight flex-shrink-0 ${className}`}
        style={{ width: px, height: px, fontSize: `${Math.round(size * 0.42)}px` }}
        aria-label={name}
      >
        {initial}
      </div>
    );
  }

  // Multi-character initials never used right now, but kept for if you later
  // want a different "no-photo" treatment.
  void initials;

  return (
    <Image
      src={photo!}
      alt={name}
      width={size}
      height={size}
      unoptimized
      className={`rounded-full object-cover flex-shrink-0 ${className}`}
      style={{ width: px, height: px }}
    />
  );
}
