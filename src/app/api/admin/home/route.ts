import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  getStudioHomeContent,
  updateStudioHomeContent,
} from "@/services/home-content.service";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const content = await getStudioHomeContent();
    return NextResponse.json({
      success: true,
      data: {
        bioHeading: content.bioHeading,
        bioBody: content.bioBody,
        bioPublished: content.bioPublished,
        updatedAt: content.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("ADMIN_HOME_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load home page settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { bioHeading, bioBody, bioPublished } = body as {
      bioHeading?: string;
      bioBody?: string;
      bioPublished?: boolean;
    };

    if (typeof bioHeading !== "string" || typeof bioBody !== "string") {
      return NextResponse.json(
        { error: "bioHeading and bioBody are required" },
        { status: 400 },
      );
    }

    const content = await updateStudioHomeContent({
      bioHeading,
      bioBody,
      bioPublished: Boolean(bioPublished),
    });

    revalidatePath("/");
    revalidatePath("/about");

    return NextResponse.json({
      success: true,
      data: {
        bioHeading: content.bioHeading,
        bioBody: content.bioBody,
        bioPublished: content.bioPublished,
        updatedAt: content.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("ADMIN_HOME_PUT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save home page settings" },
      { status: 500 },
    );
  }
}
