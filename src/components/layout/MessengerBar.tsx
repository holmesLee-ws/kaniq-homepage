import { site } from "@/config/site";
import { barNote, messengerView } from "@/lib/launch";
import type { Dictionary } from "@/content/types";
import { MessengerCta } from "@/components/cta/MessengerCta";
import { QuoteStartLink } from "@/components/cta/QuoteStartLink";
export function MessengerBar({ dict }: { dict: Dictionary }) {
  return (
    <aside className="msgbar">
      <div className="wrap">
        <p>{barNote(dict, site.launchState)}</p>
        <div className="acts">
          <MessengerCta
            view={messengerView(dict, site.launchState, site.messengerUrls)}
          />
          <QuoteStartLink lang={dict.lang} variant="quiet">
            {dict.quote.title}
          </QuoteStartLink>
        </div>
      </div>
    </aside>
  );
}
