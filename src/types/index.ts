import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../trpc";

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["getFileMessages"]["messages"];

type OmitTextMessage = Omit<Messages[number], "message">;

export type ExtendedMessage = OmitTextMessage & {
  message: string | React.ReactElement;
};
