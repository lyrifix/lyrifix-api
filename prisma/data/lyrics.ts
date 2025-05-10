import { CreateLyricType } from "../../src/schema/lyric";
import { prepareText } from "../../src/lib/text";

import lyricIndonesiaRaya from "./lyrics/indonesia-raya";
import lyricKimigayo from "./lyrics/kimigayo";
import lyricAntiHero from "./lyrics/anti-hero";
import lyric33x from "./lyrics/33x";
import lyricBetterDays from "./lyrics/better-days";
import lyricMyHero from "./lyrics/my-hero";
import lyricRencanaUsang from "./lyrics/rencana-usang";
import lyricWhyGerogia from "./lyrics/why-georgia";


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
  {
    slug: "33x-v1",
    songSlug: "33x",
    text: prepareText(lyric33x),
  },
  {
    slug: "better-days-v1",
    songSlug: "better-days",
    text: prepareText(lyricBetterDays),
  },
  {
    slug: "my-hero-v1",
    songSlug: "my-hero",
    text: prepareText(lyricMyHero),
  },
  {
    slug: "rencana-usang-v1",
    songSlug: "rencana-usang",
    text: prepareText(lyricRencanaUsang),
  },
  {
    slug: "why-georgia-v1",
    songSlug: "why-georgia",
    text: prepareText(lyricWhyGerogia),
  },
  
];
