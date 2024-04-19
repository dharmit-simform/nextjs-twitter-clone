import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb";

interface SinglePostProps {
  postId: string
}

export const GET = async (req: Request, { params }: { params: SinglePostProps }) => {
  try {
    const { postId } = params;

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 400 })
  }
}