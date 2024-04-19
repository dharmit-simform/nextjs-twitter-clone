import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const { userId } = params;

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hasNotification: false
      }
    });

    return NextResponse.json(notifications, { status: 200 });

  } catch (error) {
    return NextResponse.json({}, { status: 500 })
  }
}