-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lyric" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "updatedAt" DROP NOT NULL;
