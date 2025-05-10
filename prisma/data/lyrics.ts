import { CreateLyricType } from "../../src/schema/lyric";
import { prepareText } from "../../src/lib/text";

import lyricIndonesiaRaya from "./lyrics/indonesia-raya";
import lyricKimigayo from "./lyrics/kimigayo";
import lyricAntiHero from "./lyrics/anti-hero";

export const dataLyrics: CreateLyricType[] = [
  {
    slug: "indonesia-raya-v1",
    songSlug: "indonesia-raya",
    text: prepareText(lyricIndonesiaRaya),
  },
  {
    slug: "kimigayo-v1",
    songSlug: "kimigayo",
    text: prepareText(lyricKimigayo),
  },
  {
    slug: "anti-hero-v1",
    songSlug: "anti-hero",
    text: prepareText(lyricAntiHero),
  },
];
