/*
  Warnings:

  - Changed the type of `value` on the `ColumnValue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "width" INTEGER DEFAULT 180;

-- AlterTable
ALTER TABLE "ColumnValue" DROP COLUMN "value",
ADD COLUMN     "value" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
