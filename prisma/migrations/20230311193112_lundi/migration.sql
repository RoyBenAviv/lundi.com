/*
  Warnings:

  - You are about to drop the column `columnId` on the `ColumnValue` table. All the data in the column will be lost.
  - You are about to drop the column `boardId` on the `Groups` table. All the data in the column will be lost.
  - You are about to drop the `_BoardColumn` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `value` on table `ColumnValue` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ColumnValue" DROP CONSTRAINT "ColumnValue_columnId_fkey";

-- DropForeignKey
ALTER TABLE "ColumnValue" DROP CONSTRAINT "ColumnValue_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Groups" DROP CONSTRAINT "Groups_boardId_fkey";

-- DropForeignKey
ALTER TABLE "_BoardColumn" DROP CONSTRAINT "_BoardColumn_A_fkey";

-- DropForeignKey
ALTER TABLE "_BoardColumn" DROP CONSTRAINT "_BoardColumn_B_fkey";

-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "boardsId" TEXT;

-- AlterTable
ALTER TABLE "ColumnValue" DROP COLUMN "columnId",
ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "itemId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Groups" DROP COLUMN "boardId",
ADD COLUMN     "boardsId" TEXT;

-- DropTable
DROP TABLE "_BoardColumn";

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_boardsId_fkey" FOREIGN KEY ("boardsId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_boardsId_fkey" FOREIGN KEY ("boardsId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
