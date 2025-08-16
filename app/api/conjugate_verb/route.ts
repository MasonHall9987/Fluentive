import { NextRequest, NextResponse } from "next/server";
import sdapi from "sdapi"

export async function POST(req: NextRequest) {
  const { verb } = await req.json()
  const result = await sdapi.translate(verb)
  return NextResponse.json({ result })
}