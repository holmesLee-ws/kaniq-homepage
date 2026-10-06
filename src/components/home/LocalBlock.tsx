import Image from "next/image";
import photo from "../../../public/img/c-family-palace.jpg";
import { site } from "@/config/site";
import { messengerView } from "@/lib/launch";
import type { Dictionary } from "@/content/types";
import { MessengerCta } from "@/components/cta/MessengerCta";
export function LocalBlock({ dict: d }: { dict: Dictionary }) {
  return (
    <section id="care" className="section wrap split">
      <div className="local-panel">
        <h2>{d.local.title}</h2>
        <h3>{d.local.priorityTitle}</h3>
        <ul className="care-chips">
          {d.local.priorityCare.map((id) => (
            <li key={id} data-care={id}>
              {d.care[id]}
            </li>
          ))}
        </ul>
        <h3>{d.local.specialTitle}</h3>
        <p>{d.local.special}</p>
        <MessengerCta
          view={messengerView(d, site.launchState, site.messengerUrls)}
        />
      </div>
      <figure>
        <Image
          src={photo}
          alt={d.local.photoAlt}
          sizes="(max-width:860px) 100vw, 40vw"
        />
        <figcaption>{d.local.photoCaption}</figcaption>
      </figure>
    </section>
  );
}
