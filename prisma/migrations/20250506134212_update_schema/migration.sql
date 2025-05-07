/*
  Warnings:

  - Made the column `updatedAt` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Lyric` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lyric" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "updatedAt" SET NOT NULL;
