import serverAuth from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const PATCH = async (req: NextRequest) => {
  try {
    const { currentUser } = await serverAuth();

    const { name, username, bio, profileImage, coverImage } = await req.json();

    if (!name || !username) {
      return NextResponse.json({ error: 'Missing Fields' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage
      }
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({}, { status: 500 })
  }

}