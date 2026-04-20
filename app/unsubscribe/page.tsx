import { Metadata } from "next";
import UnsubscribeClient from "./unsubscribe-client";

export const metadata: Metadata = {
  title: "unsubscribe alerts",
};

export default function UnsubscribePage() {
  return <UnsubscribeClient />;
}
