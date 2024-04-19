import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({}, { status: 400 })
  }
}