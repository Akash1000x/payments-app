"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from "next/navigation";

export async function createOnRampTransaction(
  provider: string,
  amount: number,
  redirectUrl: string,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const token = Math.random() * 1000;
  await prisma.onRampTransaction.create({
    data: {
      provider,
      startTime: new Date(),
      status: "Processing",
      amount: amount * 100,
      token: token.toString(),
      userId: Number(session?.user?.id),
    },
  });

  redirect(redirectUrl);

  return {
    message: "Done",
  };
}
