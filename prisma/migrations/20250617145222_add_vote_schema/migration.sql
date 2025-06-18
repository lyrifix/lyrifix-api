/*
  Warnings:

  - Added the required column `upvoteCount` to the `Lyric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lyric" ADD COLUMN     "upvoteCount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "isUpvote" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "lyricId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_lyricId_fkey" FOREIGN KEY ("lyricId") REFERENCES "Lyric"("id") ON DELETE SET NULL ON UPDATE CASCADE;
