/*
  Warnings:

  - You are about to drop the column `boardsId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `columnValueId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `boardsId` on the `Groups` table. All the data in the column will be lost.
  - Added the required column `columnId` to the `ColumnValue` table without a default value. This is not possible if the table is not empty.
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

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "boardsId",
DROP COLUMN "columnValueId";

-- AlterTable
ALTER TABLE "ColumnValue" ADD COLUMN     "columnId" TEXT NOT NULL,
ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "itemId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Groups" DROP COLUMN "boardsId",
ADD COLUMN     "boardId" TEXT;

-- CreateTable
CREATE TABLE "_BoardColumn" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoardColumn_AB_unique" ON "_BoardColumn"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardColumn_B_index" ON "_BoardColumn"("B");

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardColumn" ADD CONSTRAINT "_BoardColumn_A_fkey" FOREIGN KEY ("A") REFERENCES "Boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardColumn" ADD CONSTRAINT "_BoardColumn_B_fkey" FOREIGN KEY ("B") REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;
