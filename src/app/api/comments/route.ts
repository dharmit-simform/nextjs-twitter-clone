import serverAuth from "@/lib/serverAuth";
import prisma from "@/lib/prismadb";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { currentUser } = await serverAuth();
    const { body } = await req.json();
    const postId = req.nextUrl.searchParams.get('postId');

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid Id')
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId
      }
    });

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId
        }
      })

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: 'Someone replied to your tweet!',
            userId: post?.userId
          }
        });

        await prisma.user.update({
          where: {
            id: post?.userId
          },
          data: {
            hasNotification: true
          }
        })
      }
    } catch (error) {
      console.log(error)
    }

    return NextResponse.json(comment, { status: 200 })

  } catch (error) {
    console.log(error);
    NextResponse.json({}, { status: 500 });
  }
}