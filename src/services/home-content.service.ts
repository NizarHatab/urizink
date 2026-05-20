import { db } from "@/db";
import {
  HOME_CONTENT_KEY,
  studioHomeContent,
} from "@/db/schema/studio-home-content";
import {
  DEFAULT_ABOUT_PAGE,
  mergeAboutPageContent,
  type AboutPageContent,
} from "@/lib/about-page";
import { eq } from "drizzle-orm";

export type StudioHomeContent = {
  bioHeading: string;
  bioBody: string;
  bioPublished: boolean;
  updatedAt: Date;
};

const DEFAULT: StudioHomeContent = {
  bioHeading: "Meet Uriz",
  bioBody: "",
  bioPublished: false,
  updatedAt: new Date(),
};

export async function getStudioHomeContent(): Promise<StudioHomeContent> {
  try {
    return await getStudioHomeContentFromDb();
  } catch (e) {
    console.error("HOME_CONTENT_READ:", e);
    return DEFAULT;
  }
}

async function getStudioHomeContentFromDb(): Promise<StudioHomeContent> {
  const [row] = await db
    .select({
      bioHeading: studioHomeContent.bioHeading,
      bioBody: studioHomeContent.bioBody,
      bioPublished: studioHomeContent.bioPublished,
      updatedAt: studioHomeContent.updatedAt,
    })
    .from(studioHomeContent)
    .where(eq(studioHomeContent.singletonKey, HOME_CONTENT_KEY))
    .limit(1);

  if (!row) return DEFAULT;

  return {
    bioHeading: row.bioHeading?.trim() || DEFAULT.bioHeading,
    bioBody: row.bioBody?.trim() || "",
    bioPublished: row.bioPublished,
    updatedAt: row.updatedAt,
  };
}

export async function getPublishedStudioIntro(): Promise<{
  heading: string;
  body: string;
} | null> {
  try {
    const content = await getStudioHomeContentFromDb();
    if (!content.bioPublished) return null;
    const body = content.bioBody.trim();
    const heading = content.bioHeading.trim() || DEFAULT.bioHeading;
    if (!body && !heading) return null;
    return { heading, body };
  } catch (e) {
    console.error("HOME_INTRO_PUBLISHED:", e);
    return null;
  }
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const [row] = await db
      .select({ aboutPage: studioHomeContent.aboutPage })
      .from(studioHomeContent)
      .where(eq(studioHomeContent.singletonKey, HOME_CONTENT_KEY))
      .limit(1);
    return mergeAboutPageContent(row?.aboutPage);
  } catch (e) {
    console.error("ABOUT_PAGE_READ:", e);
    return DEFAULT_ABOUT_PAGE;
  }
}

export async function updateAboutPageContent(
  data: AboutPageContent,
): Promise<AboutPageContent> {
  const merged = mergeAboutPageContent(data);
  const existing = await db
    .select({ id: studioHomeContent.id })
    .from(studioHomeContent)
    .where(eq(studioHomeContent.singletonKey, HOME_CONTENT_KEY))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(studioHomeContent).values({
      singletonKey: HOME_CONTENT_KEY,
      aboutPage: merged,
    });
  } else {
    await db
      .update(studioHomeContent)
      .set({ aboutPage: merged, updatedAt: new Date() })
      .where(eq(studioHomeContent.singletonKey, HOME_CONTENT_KEY));
  }
  return getAboutPageContent();
}

export async function updateStudioHomeContent(data: {
  bioHeading: string;
  bioBody: string;
  bioPublished: boolean;
}): Promise<StudioHomeContent> {
  try {
    return await updateStudioHomeContentInDb(data);
  } catch (e) {
    console.error("HOME_CONTENT_WRITE:", e);
    throw e;
  }
}

async function updateStudioHomeContentInDb(data: {
  bioHeading: string;
  bioBody: string;
  bioPublished: boolean;
}): Promise<StudioHomeContent> {
  const heading = data.bioHeading.trim().slice(0, 200) || "Meet Uriz";
  const body = data.bioBody.trim();
  const published = data.bioPublished;

  const existing = await db
    .select({ id: studioHomeContent.id })
    .from(studioHomeContent)
    .where(eq(studioHomeContent.singletonKey, HOME_CONTENT_KEY))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(studioHomeContent).values({
      singletonKey: HOME_CONTENT_KEY,
      bioHeading: heading,
      bioBody: body,
      bioPublished: published,
    });
  } else {
    await db
      .update(studioHomeContent)
      .set({
        bioHeading: heading,
        bioBody: body,
        bioPublished: published,
        updatedAt: new Date(),
      })
      .where(eq(studioHomeContent.singletonKey, HOME_CONTENT_KEY));
  }

  return getStudioHomeContentFromDb();
}
