/*
  Warnings:

  - You are about to drop the column `boardId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `columnId` on the `ColumnValue` table. All the data in the column will be lost.
  - You are about to drop the column `boardId` on the `Groups` table. All the data in the column will be lost.
  - You are about to drop the column `boardId` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_boardId_fkey";

-- DropForeignKey
ALTER TABLE "ColumnValue" DROP CONSTRAINT "ColumnValue_columnId_fkey";

-- DropForeignKey
ALTER TABLE "ColumnValue" DROP CONSTRAINT "ColumnValue_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_boardId_fkey";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "boardId",
ADD COLUMN     "boardsId" TEXT,
ADD COLUMN     "columnValueId" TEXT;

-- AlterTable
ALTER TABLE "ColumnValue" DROP COLUMN "columnId",
ALTER COLUMN "itemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Groups" DROP COLUMN "boardId",
ADD COLUMN     "boardsId" TEXT;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "boardId",
ADD COLUMN     "boardsId" TEXT;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_boardsId_fkey" FOREIGN KEY ("boardsId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_boardsId_fkey" FOREIGN KEY ("boardsId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_boardsId_fkey" FOREIGN KEY ("boardsId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_columnValueId_fkey" FOREIGN KEY ("columnValueId") REFERENCES "ColumnValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
