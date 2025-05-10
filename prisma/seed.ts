import { PrismaClient } from "../src/generated/prisma";
import { dataArtists } from "./data/artists";
import { dataLyrics } from "./data/lyrics";
import { dataSongs } from "./data/songs";

const prisma = new PrismaClient();

async function main() {
  // Seed Artists
  for (const artist of dataArtists) {
    const newArtist = await prisma.artist.upsert({
      where: { slug: artist.slug },
      update: artist,
      create: artist,
    });
    console.info(`🎤 Artist: ${newArtist.name}`);
  }

  // Seed Songs
  for (const songData of dataSongs) {
    const { artistSlugs, ...song } = songData;

    const upsertedSong = await prisma.song.upsert({
      where: { slug: songData.slug },
      update: song,
      create: {
        ...song,
        artists: { connect: { slug: artistSlugs[0] } },
      },
    });
    console.info(`🎤 Song: ${upsertedSong.title}`);
  }

  // Seed Lyrics
  for (const lyricData of dataLyrics) {
    const { songSlug, ...lyric } = lyricData;

    const upsertedLyric = await prisma.lyric.upsert({
      where: { slug: lyric.slug },
      update: lyric,
      create: {
        ...lyric,
        song: { connect: { slug: songSlug } },
      },
    });

    console.info(`🎤 Lyric: ${upsertedLyric.slug}`);
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
