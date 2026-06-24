import { NextResponse } from "next/server";
import { getWaitlistCount } from "@/lib/waitlistCount";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getWaitlistCount();
  return NextResponse.json(result);
}
