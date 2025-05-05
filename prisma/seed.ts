import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

import { dataArtists } from "./data/artists";
import { dataSongs } from "./data/songs";
import { dataLyrics } from "./data/lyrics";
import { createNewSlug } from "../src/lib/slugify";

async function main() {
  // Seed Artists
  for (const artist of dataArtists) {
    const newArtistResult = await prisma.artist.upsert({
      where: { slug: artist.slug },
      update: artist,
      create: {
        ...artist,
        slug: createNewSlug(artist.name),
      },
    });
    console.info(`🎤 Artist: ${newArtistResult.name}`);
  }

  // Seed Songs
  for (const song of dataSongs) {
    const { artistSlug, ...songData } = song;
    const newSongResult = await prisma.song.upsert({
      where: { slug: song.slug },
      update: {
        ...songData,
        artists: {
          connect: { slug: artistSlug },
        },
      },
      create: {
        ...songData,
        slug: createNewSlug(song.title),
        artists: {
          connect: { slug: artistSlug },
        },
      },
    });
    console.info(`🎵 Song: ${newSongResult.title}`);
  }

  // Seed Lyrics
  for (const lyric of dataLyrics) {
    const { songSlug, ...lyricData } = lyric;
    const song = await prisma.song.findUnique({
      where: { slug: songSlug },
    });

    if (!song) {
      console.error(`Song with slug ${songSlug} not found`);
      continue;
    }

    const newLyricResult = await prisma.lyric.upsert({
      where: { slug: lyric.slug },
      update: {
        ...lyricData,
        songId: song.id,
      },
      create: {
        ...lyricData,
        slug: createNewSlug(`${songSlug}-${lyricData.text.slice(0, 20)}`),
        songId: song.id,
      },
    });
    console.info(`📝 Lyric: ${newLyricResult.text.slice(0, 30)}...`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
