/*
  Warnings:

  - You are about to drop the `_SongToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SongToUser" DROP CONSTRAINT "_SongToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SongToUser" DROP CONSTRAINT "_SongToUser_B_fkey";

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Lyric" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_SongToUser";

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lyric" ADD CONSTRAINT "Lyric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
