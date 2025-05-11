import { prepareText } from "../../src/lib/text";
import { CreateLyricType } from "../../src/modules/lyric/schema";

import lyric33x from "./lyrics/33x";
import lyricAntiHero from "./lyrics/anti-hero";
import lyricBetterDays from "./lyrics/better-days";
import lyricButterfly from "./lyrics/butterfly";
import lyricGaramDanMadu from "./lyrics/garam-dan-madu";
import lyricIndonesiaRaya from "./lyrics/indonesia-raya";
import lyricInsideOut from "./lyrics/inside-out";
import lyricKimigayo from "./lyrics/kimigayo";
import lyricMyHero from "./lyrics/my-hero";
import lyricRencanaUsang from "./lyrics/rencana-usang";
import lyricShoot from "./lyrics/shoot";
import lyricWhyGerogia from "./lyrics/why-georgia";
import lyricYouWillBeInMyHeart from "./lyrics/you-will-be-in-my-heart";
import lyricWeCantBeFriends from "./lyrics/we-cant-be-friends";
import lyricSupernatural from "./lyrics/supernatural";

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
  {
    slug: "garam-dan-madu-v1",
    songSlug: "garam-dan-madu",
    text: prepareText(lyricGaramDanMadu),
  },
  {
    slug: "shoot-v1",
    songSlug: "shoot",
    text: prepareText(lyricShoot),
  },
  {
    slug: "butterfly-v1",
    songSlug: "butterfly",
    text: prepareText(lyricButterfly),
  },
  {
    slug: "you-will-be-in-my-heart-v1",
    songSlug: "you-will-be-in-my-heart",
    text: prepareText(lyricYouWillBeInMyHeart),
  },

  {
    slug: "inside-out-v1",
    songSlug: "inside-out",
    text: prepareText(lyricInsideOut),
  },
  {
    slug: "we-cant-be-friends-v1",
    songSlug: "we-cant-be-friends",
    text: prepareText(lyricWeCantBeFriends),
  },
  {
    slug: "supernatural-v1",
    songSlug: "supernatural",
    text: prepareText(lyricSupernatural),
  },
];
