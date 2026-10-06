import { getImageProps } from "next/image";
import photo from "../../../public/img/c-family-palace.jpg";
import { site } from "@/config/site";
import { messengerView } from "@/lib/launch";
import type { Dictionary } from "@/content/types";
import { MessengerCta } from "@/components/cta/MessengerCta";
export function LocalBlock({ dict: d }: { dict: Dictionary }) {
  const { props } = getImageProps({
    src: photo,
    alt: d.local.photoAlt,
    width: 640,
    height: 800,
    quality: 75,
  });
  const { srcSet: omittedSrcSet, ...img } = props;
  void omittedSrcSet;
  return (
    <section id="care" className="section wrap care-split">
      <div className="local-panel" data-reveal>
        <h2>{d.local.title}</h2>
        <h3>{d.local.priorityTitle}</h3>
        <ul className="care-chips">
          {d.local.priorityCare.map((id, i) => (
            <li
              key={id}
              data-care={id}
              style={{ "--i": i } as React.CSSProperties}
            >
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
        <div className="care-photo" data-scroll="view">
          {/* Single density source preserves decoded dimensions for the high resolution photo. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...img}
            alt={d.local.photoAlt}
            width={1280}
            height={1600}
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption>{d.local.photoCaption}</figcaption>
      </figure>
    </section>
  );
}
