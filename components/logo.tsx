import Image from "next/image";

/** White lockup on transparent — only for dark backgrounds. Source is 948px wide; don't display it larger. */
export function Logo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo.png"
      alt=""
      width={948}
      height={250}
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}
