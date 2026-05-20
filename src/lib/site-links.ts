/** Public social links — override in .env.local or Vercel if handles change. */
export const SITE_SOCIAL = {
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
    "https://www.instagram.com/uriz_inkk/",
  tiktok:
    process.env.NEXT_PUBLIC_TIKTOK_URL?.trim() ||
    "https://www.tiktok.com/@black_cloverink",
  instagramHandle: "@uriz_inkk",
  tiktokHandle: "@uriz_inkk",
} as const;
