import Image from "next/image";
import { withBasePath } from "@/lib/site";

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
      src={withBasePath("/focus-terminal-icon.png")}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      priority={priority}
      aria-hidden="true"
    />
  );
}
