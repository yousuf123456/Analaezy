import prisma from "@/prismadb/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    const userId = data.custom_data.userId;
    const subscriptionId = data.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (user.subscriptionId === subscriptionId) {
      return NextResponse.json("Async user data with subscription succesfully");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        subscriptionId,
      },
    });

    return NextResponse.json("Async user data with subscription succesfully");
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
