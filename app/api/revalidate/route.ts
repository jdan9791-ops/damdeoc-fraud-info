import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const { slug } = await req.json().catch(() => ({}));

  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/fraud/${slug}`);

  return NextResponse.json({ revalidated: true, slug: slug ?? "all" });
}
