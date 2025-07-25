import serverAuth from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await req.json();

    const { currentUser } = await serverAuth();

    if (!userId || typeof userId !== "string") {
      throw new Error('Invalid Id');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({}, { status: 400 })
    }

    try {
      await prisma.notification.create({
        data: {
          body: 'Someone followed you.!',
          userId
        }
      });

      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          hasNotification: true
        }
      })

    } catch (error) {
      console.log(error);
    }

    let updatedFollowingIds = [...(user.followingIds) || []];
    updatedFollowingIds.push(userId);

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        followingIds: updatedFollowingIds
      }
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    return NextResponse.json({}, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { userId } = await req.json();

    const { currentUser } = await serverAuth();

    if (!userId || typeof userId !== "string") {
      throw new Error('Invalid Id');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({}, { status: 400 })
    }

    let updatedFollowingIds = [...(user.followingIds) || []];
    updatedFollowingIds = updatedFollowingIds.filter(followingId => followingId !== userId)

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        followingIds: updatedFollowingIds
      }
    })

    return NextResponse.json(updatedUser, { status: 200 })

  } catch (error) {
    return NextResponse.json({}, { status: 400 })
  }

}