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
        songs: {
          connect: {
            id: "",
          },
        },
      },
    });
    console.info(`🎤 Artist: ${newArtistResult.name}`);
  }

  // Seed Songs
  for (const song of dataSongs) {
    const newSongResult = await prisma.song.upsert({
      where: { slug: song.slug },
      update: {
        ...song,
      },
      create: {
        ...song,
        slug: createNewSlug(song.title),
        artists: {
          connect: {
            id: "",
          },
        },
        lyrics: {
          connect: {
            id: "",
          },
        },
      },
    });
    console.info(`🎵 Song: ${newSongResult.title}`);
  }

  // Seed Lyrics
  for (const lyric of dataLyrics) {
    const song = await prisma.song.findUnique({
      where: { slug: lyric.slug },
    });

    if (!song) {
      console.error(`Song with slug ${song} not found`);
      continue;
    }

    const newLyricResult = await prisma.lyric.upsert({
      where: { slug: lyric.slug },
      update: {
        ...lyric,
        songId: song.id,
      },
      create: {
        ...lyric,
        slug: createNewSlug(`${song.slug}-${lyric.text.slice(0, 20)}`),
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
