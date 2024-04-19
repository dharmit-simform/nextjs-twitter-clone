import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prismadb";

interface SingleUser {
  userId: string;
}

export const GET = async (req: NextRequest, { params }: { params: SingleUser }) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: params.userId
      }
    });

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: params.userId
        }
      }
    })

    return NextResponse.json({ ...existingUser, followersCount }, { status: 200 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 400 })
  }
}