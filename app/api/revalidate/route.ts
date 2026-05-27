import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SECRET =
  process.env.REVALIDATE_SECRET ||
  "2b2b934953934316bdaed5ba51e770cb7c26456f392440899ff35a85d98b58ef";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const { slug } = await req.json().catch(() => ({}));

  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/fraud/${slug}`);

  return NextResponse.json({ revalidated: true, slug: slug ?? "all" });
}
