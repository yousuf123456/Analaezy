import prisma from "@/prismadb/db";

export const getSubscriptionInfo = async (userId: string | undefined) => {
  if (!userId)
    return {
      isSubscribed: false,
      subscription: undefined,
    };

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || !user.subscriptionId)
    return {
      isSubscribed: false,
      subscription: undefined,
    };

  const response = await fetch(
    `https://sandbox-api.paddle.com/subscriptions/${user.subscriptionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const { data } = await response.json();

  if (!data || data?.status === "cancelled" || data?.cancelledAt)
    return {
      isSubscribed: false,
      subscription: undefined,
    };

  return {
    isSubscribed: true,
    subscription: data,
  };
};
