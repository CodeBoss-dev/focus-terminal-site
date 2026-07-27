const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteBasePath =
  rawBasePath === "/" ? "" : rawBasePath.replace(/\/+$/, "");

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteBasePath}${normalizedPath}`;
}
