import { mergeAboutPageContent, type AboutPageContent } from "@/lib/about-page";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  getAboutPageContent,
  updateAboutPageContent,
} from "@/services/home-content.service";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const content = await getAboutPageContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("ADMIN_ABOUT_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load about page" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const content = mergeAboutPageContent(body as AboutPageContent);
    const saved = await updateAboutPageContent(content);
    revalidatePath("/");
    revalidatePath("/about");
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("ADMIN_ABOUT_PUT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save about page" },
      { status: 500 },
    );
  }
}
