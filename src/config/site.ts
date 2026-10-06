import type { MessengerId } from "@/content/shared/messengers";
export type LaunchState = "preview" | "live";
export const site = {
  brand: "KANIQ",
  url: "https://kaniq-homepage.vercel.app",
  launchState: "preview" as LaunchState,
  registration: {
    medicalTourism: "SAMPLE-0000-000",
    travelAgency: "SAMPLE-0000-000",
  },
  messengerUrls: {
    WhatsApp: "",
    LINE: "",
    Messenger: "",
    KakaoTalk: "",
  } as Record<MessengerId, string>,
} as const;
