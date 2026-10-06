import type { Dictionary } from "@/content/types";
import type { LaunchState } from "@/config/site";
import { MESSENGERS, type MessengerId } from "@/content/shared/messengers";
export function messengerView(
  dict: Dictionary,
  state: LaunchState,
  urls: Record<MessengerId, string>,
) {
  const channel = dict.messenger.channel;
  const href = state === "live" && urls[channel] ? urls[channel] : null;
  return {
    channel,
    label: dict.messenger.chatOn.replace("{name}", channel),
    href,
    soonText: href ? null : dict.messenger.opensAtLaunch,
    colors: MESSENGERS[channel],
  };
}
export const previewBandText = (d: Dictionary, s: LaunchState) =>
  s === "preview" ? d.previewBand : null;
export const barNote = (d: Dictionary, s: LaunchState) =>
  s === "live" ? d.live.replyPromise : d.msgbar.previewNote;
export const quoteNotice = (d: Dictionary, s: LaunchState) =>
  s === "preview" ? d.quote.previewNotice : null;
export const quoteDoneText = (d: Dictionary, s: LaunchState) =>
  s === "live" ? d.live.quoteDone : d.quote.donePreview;
export function visibleCopy(d: Dictionary, s: LaunchState) {
  if (s === "live") return d;
  const { live, ...copy } = d;
  void live;
  return copy;
}
