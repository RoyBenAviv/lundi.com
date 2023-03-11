/*
  Warnings:

  - You are about to drop the column `boardsId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `columnValueId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `boardsId` on the `Groups` table. All the data in the column will be lost.
  - You are about to drop the column `boardsId` on the `Users` table. All the data in the column will be lost.
  - Made the column `itemId` on table `ColumnValue` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_boardsId_fkey";

-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_columnValueId_fkey";

-- DropForeignKey
ALTER TABLE "ColumnValue" DROP CONSTRAINT "ColumnValue_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_boardsId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_boardsId_fkey";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "boardsId",
DROP COLUMN "columnValueId",
ADD COLUMN     "boardId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ColumnValue" ADD COLUMN     "columnId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "itemId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Groups" DROP COLUMN "boardsId",
ADD COLUMN     "boardId" TEXT;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "boardsId",
ADD COLUMN     "boardId" TEXT;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
