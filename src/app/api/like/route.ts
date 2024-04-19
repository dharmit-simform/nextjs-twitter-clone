import serverAuth from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  try {
    const { postId } = await req.json();

    const { currentUser } = await serverAuth();

    if (!postId || typeof postId !== "string") {
      throw new Error('Invalid Id');
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    if (!post) {
      return NextResponse.json({}, { status: 400 })
    }

    let updatedLikedIds = [...(post.likedIds) || []];
    updatedLikedIds.push(currentUser.id);

    const updatedPost = await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        likedIds: updatedLikedIds
      }
    });

    try {
      if (updatedPost?.userId) {
        await prisma.notification.create({
          data: {
            body: 'Someone Liked your tweet!',
            userId: updatedPost.userId
          }
        });

        await prisma.user.update({
          where: {
            id: updatedPost.userId
          },
          data: {
            hasNotification: true
          }
        })
      }
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json(updatedPost, { status: 200 })
  } catch (error) {
    return NextResponse.json({}, { status: 400 })
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { postId } = await req.json();

    const { currentUser } = await serverAuth();

    if (!postId || typeof postId !== "string") {
      throw new Error('Invalid Id');
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    if (!post) {
      return NextResponse.json({}, { status: 400 })
    }

    let updatedLikedIds = [...(post.likedIds) || []];
    updatedLikedIds = updatedLikedIds.filter(likedId => likedId !== currentUser.id);

    const updatedPost = await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        likedIds: updatedLikedIds
      }
    })

    return NextResponse.json(updatedPost, { status: 200 })

  } catch (error) {
    return NextResponse.json({}, { status: 400 })
  }

}