/** Single-studio branding (UrizInk). Override with NEXT_PUBLIC_STUDIO_NAME if needed. */
export function getStudioDisplayName(): string {
  return process.env.NEXT_PUBLIC_STUDIO_NAME?.trim() || "Uriz";
}
