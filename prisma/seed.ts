import { PrismaClient } from "../src/generated/prisma";
import { hashPassword } from "../src/lib/password";
import { dataArtists } from "./data/artists";
import { dataLyrics } from "./data/lyrics";
import { dataSongs } from "./data/songs";
import { dataUsers } from "./data/users";
import { getRandomizedUserId } from "./randomize";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  for (const userData of dataUsers) {
    const { password, ...user } = userData;
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.upsert({
      where: { email: userData.email },
      update: user,
      create: {
        ...user,
        password: { create: { hash: hashedPassword } },
      },
    });
    console.info(`👤 User: ${newUser.username}`);
  }

  const userJohnDoe = await prisma.user.findUnique({
    where: { username: "johndoe" },
  });
  const userJaneDoe = await prisma.user.findUnique({
    where: { username: "janedoe" },
  });
  if (!userJohnDoe || !userJaneDoe) {
    throw new Error("Users not found");
  }

  // Seed Artists
  for (const artistData of dataArtists) {
    const newArtist = await prisma.artist.upsert({
      where: { slug: artistData.slug },
      update: artistData,
      create: {
        ...artistData,
        userId: getRandomizedUserId(userJohnDoe, userJaneDoe),
      },
    });
    console.info(`🧑‍🎤 Artist: ${newArtist.name}`);
  }

  // Seed Songs
  for (const songData of dataSongs) {
    const { artistSlugs, ...song } = songData;
    const connectArtistSlugs = artistSlugs.map((slug) => ({ slug }));

    const upsertedSong = await prisma.song.upsert({
      where: { slug: songData.slug },
      update: song,
      create: {
        ...song,
        artists: { connect: connectArtistSlugs },
        userId: getRandomizedUserId(userJohnDoe, userJaneDoe),
      },
    });
    console.info(`🎵 Song: ${upsertedSong.title}`);
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
        user: {
          connect: { id: getRandomizedUserId(userJohnDoe, userJaneDoe) },
        },
      },
    });

    console.info(`🗒️ Lyric: ${upsertedLyric.slug}`);
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
