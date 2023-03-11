/*
  Warnings:

  - You are about to drop the column `itemId` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Column` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_itemId_fkey";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "itemId",
DROP COLUMN "value",
ADD COLUMN     "columnValueId" TEXT;

-- CreateTable
CREATE TABLE "ColumnValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "itemId" TEXT,

    CONSTRAINT "ColumnValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_columnValueId_fkey" FOREIGN KEY ("columnValueId") REFERENCES "ColumnValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
