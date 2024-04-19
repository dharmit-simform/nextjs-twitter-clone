import { NextRequest, NextResponse } from "next/server";

import serverAuth from "@/lib/serverAuth";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    let posts;

    if (userId && typeof userId === 'string') {
      posts = await prisma.post.findMany({
        where: {
          userId
        },
        include: {
          user: true,
          comments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      posts = await prisma.post.findMany({
        include: {
          user: true,
          comments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json(posts, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { currentUser } = await serverAuth();
    const { body } = await req.json();

    const post = await prisma.post.create({
      data: {
        body,
        userId: currentUser.id
      }
    })

    return NextResponse.json(post, { status: 200 })

  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 500 })
  }
}