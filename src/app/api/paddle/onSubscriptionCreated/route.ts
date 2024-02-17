import prisma from "@/prismadb/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    const subscriptionId = data.id;

    console.log(subscriptionId);
    const response = await fetch(
      `https://sandbox-api.paddle.com/subscriptions/${subscriptionId}`
    );

    const responseData = await response.json();
    console.log(responseData);

    return NextResponse.json("Async user data with subscription succesfully");
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
