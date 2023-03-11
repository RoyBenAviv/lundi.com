/*
  Warnings:

  - You are about to drop the column `itemId` on the `Column` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_itemId_fkey";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "itemId",
ADD COLUMN     "boardsId" TEXT;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_boardsId_fkey" FOREIGN KEY ("boardsId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
