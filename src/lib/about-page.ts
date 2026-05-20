import {
  Droplets,
  MessageCircle,
  Shield,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type AboutStandardItem = {
  title: string;
  text: string;
};

export type AboutPageContent = {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  artistImageCaption: string;
  workHeading: string;
  workParagraph1: string;
  workParagraph2: string;
  standardsHeading: string;
  standards: AboutStandardItem[];
  ctaEyebrow: string;
  ctaTitle: string;
  ctaButtonLabel: string;
};

export const ABOUT_STANDARD_ICONS: LucideIcon[] = [
  Shield,
  MessageCircle,
  Droplets,
  Sparkles,
];

export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  headerEyebrow: "UrizInk · Beirut",
  headerTitle: "About",
  headerSubtitle:
    "Blackwork, fine line, and custom dark art — one studio, one artist, built around your story.",
  artistImageCaption: "Uriz · Artist & founder",
  workHeading: "The work",
  workParagraph1:
    "UrizInk is a raw, monochromatic dialogue between skin and needle. Based in Beirut, the focus is black and grey — realism, fine-line geometry, and custom dark pieces that read clearly for years.",
  workParagraph2:
    "Tattoos are not decoration. They are permanent markers of identity. Every session is a collaboration: your reference, your placement, your pace — refined together before the first line goes in.",
  standardsHeading: "Studio standards",
  standards: [
    {
      title: "Sterile Environment",
      text: "Hospital-grade sterilization and single-use disposables. Safety comes first.",
    },
    {
      title: "Custom Consultation",
      text: "No copy-paste flash. Every tattoo starts with a real conversation about your idea.",
    },
    {
      title: "Premium Materials",
      text: "High-quality vegan inks and precision needles built for clean, lasting work.",
    },
    {
      title: "Aftercare Support",
      text: "Clear healing guidance so your piece settles in strong and ages well.",
    },
  ],
  ctaEyebrow: "Ready when you are",
  ctaTitle: "Start your piece",
  ctaButtonLabel: "Book a session",
};

export function mergeAboutPageContent(
  raw: unknown,
): AboutPageContent {
  if (!raw || typeof raw !== "object") return DEFAULT_ABOUT_PAGE;
  const o = raw as Partial<AboutPageContent>;
  const standards =
    Array.isArray(o.standards) && o.standards.length > 0
      ? o.standards
          .slice(0, 4)
          .map((s, i) => ({
            title:
              typeof s?.title === "string" && s.title.trim()
                ? s.title.trim()
                : DEFAULT_ABOUT_PAGE.standards[i]?.title ?? "Standard",
            text:
              typeof s?.text === "string" && s.text.trim()
                ? s.text.trim()
                : DEFAULT_ABOUT_PAGE.standards[i]?.text ?? "",
          }))
      : DEFAULT_ABOUT_PAGE.standards;

  while (standards.length < 4) {
    standards.push(DEFAULT_ABOUT_PAGE.standards[standards.length]!);
  }

  return {
    headerEyebrow:
      typeof o.headerEyebrow === "string" && o.headerEyebrow.trim()
        ? o.headerEyebrow.trim()
        : DEFAULT_ABOUT_PAGE.headerEyebrow,
    headerTitle:
      typeof o.headerTitle === "string" && o.headerTitle.trim()
        ? o.headerTitle.trim()
        : DEFAULT_ABOUT_PAGE.headerTitle,
    headerSubtitle:
      typeof o.headerSubtitle === "string"
        ? o.headerSubtitle.trim()
        : DEFAULT_ABOUT_PAGE.headerSubtitle,
    artistImageCaption:
      typeof o.artistImageCaption === "string" && o.artistImageCaption.trim()
        ? o.artistImageCaption.trim()
        : DEFAULT_ABOUT_PAGE.artistImageCaption,
    workHeading:
      typeof o.workHeading === "string" && o.workHeading.trim()
        ? o.workHeading.trim()
        : DEFAULT_ABOUT_PAGE.workHeading,
    workParagraph1:
      typeof o.workParagraph1 === "string"
        ? o.workParagraph1.trim()
        : DEFAULT_ABOUT_PAGE.workParagraph1,
    workParagraph2:
      typeof o.workParagraph2 === "string"
        ? o.workParagraph2.trim()
        : DEFAULT_ABOUT_PAGE.workParagraph2,
    standardsHeading:
      typeof o.standardsHeading === "string" && o.standardsHeading.trim()
        ? o.standardsHeading.trim()
        : DEFAULT_ABOUT_PAGE.standardsHeading,
    standards,
    ctaEyebrow:
      typeof o.ctaEyebrow === "string" && o.ctaEyebrow.trim()
        ? o.ctaEyebrow.trim()
        : DEFAULT_ABOUT_PAGE.ctaEyebrow,
    ctaTitle:
      typeof o.ctaTitle === "string" && o.ctaTitle.trim()
        ? o.ctaTitle.trim()
        : DEFAULT_ABOUT_PAGE.ctaTitle,
    ctaButtonLabel:
      typeof o.ctaButtonLabel === "string" && o.ctaButtonLabel.trim()
        ? o.ctaButtonLabel.trim()
        : DEFAULT_ABOUT_PAGE.ctaButtonLabel,
  };
}
