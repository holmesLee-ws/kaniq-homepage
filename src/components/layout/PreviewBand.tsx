import { site } from "@/config/site";
import { previewBandText } from "@/lib/launch";
import type { Dictionary } from "@/content/types";
export function PreviewBand({ dict }: { dict: Dictionary }) {
  const text = previewBandText(dict, site.launchState);
  return text ? (
    <div className="draft-note" role="note">
      {text}
    </div>
  ) : null;
}
