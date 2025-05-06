import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

import { createSlugify } from "../src/lib/slug";
import { dataArtists } from "./data/artists";
import { dataLyrics } from "./data/lyrics";
import { dataSongs } from "./data/songs";

async function main() {
  const dataLength = dataArtists.length;

  // Seed Artist
  for (const artist of dataArtists) {
    const newArtist = await prisma.artist.upsert({
      where: { slug: artist.slug },
      update: artist,
      create: {
        ...artist,
        slug: createSlugify(artist.name),
      },
    });
    console.info(`🎤 Artist: ${newArtist.name}`);
  }

  // Seed Song
  for (const song of dataSongs) {
    const newSong = await prisma.song.upsert({
      where: { slug: song.slug },
      update: song,
      create: {
        ...song,
        slug: createSlugify(song.title),
      },
    });
    console.info(`🎤 Song: ${song.title}`);
  }

  // Seed Lyric
  for (let i = 0; i < dataLength; i++) {
    const newLyric = await prisma.lyric.upsert({
      where: { slug: dataLyrics[i].slug },
      update: dataLyrics[i],
      create: {
        ...dataLyrics[i],
        slug: createSlugify(dataSongs[i].title),
      },
    });
    console.info(`🎤 Lyric: ${dataLyrics[i].slug}`);
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
