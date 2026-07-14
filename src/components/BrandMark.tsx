import Image from "next/image";

export default function BrandMark({
  size = 28,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/windowseat-icon.png"
      alt=""
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      priority={priority}
      aria-hidden="true"
    />
  );
}
