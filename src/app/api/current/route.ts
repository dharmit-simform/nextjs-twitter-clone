import serverAuth from "@/lib/serverAuth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { currentUser } = await serverAuth();

    return NextResponse.json(currentUser, { status: 200 })
  } catch (error) {
    return NextResponse.json({}, { status: 403 });
  }
}