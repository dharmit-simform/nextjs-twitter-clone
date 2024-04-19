import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { email, username, name, password } = await req.json();
    console.log(email, username, name, password);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        hashedPassword
      }
    });

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}