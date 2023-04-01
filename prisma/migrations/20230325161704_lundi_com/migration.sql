/*
  Warnings:

  - Made the column `itemId` on table `ColumnValue` required. This step will fail if there are existing NULL values in that column.
  - Made the column `columnId` on table `ColumnValue` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ColumnValue" DROP CONSTRAINT "ColumnValue_columnId_fkey";

-- DropForeignKey
ALTER TABLE "ColumnValue" DROP CONSTRAINT "ColumnValue_itemId_fkey";

-- AlterTable
ALTER TABLE "ColumnValue" ALTER COLUMN "itemId" SET NOT NULL,
ALTER COLUMN "columnId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
