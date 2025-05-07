import { PrismaClient } from "../src/generated/prisma";

import { createSlugify } from "../src/lib/slug";
import { dataArtists } from "./data/artists";
import { dataLyrics } from "./data/lyrics";
import { dataSongs } from "./data/songs";

const prisma = new PrismaClient();

async function main() {
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
  let idx = 0;
  for (const song of dataSongs) {
    const newSong = await prisma.song.upsert({
      where: { slug: song.slug },
      update: song,
      create: {
        ...song,
        slug: createSlugify(song.title),
        artists: {
          connect: {
            id: dataArtists[idx].id,
          },
        },
      },
    });
    idx++;
    console.info(`🎤 Song: ${song.title}`);
  }

  // Seed Lyric
  for (let i = 0; i < dataLyrics.length; i++) {
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
