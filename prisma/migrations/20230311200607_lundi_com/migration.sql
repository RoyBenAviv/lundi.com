-- AlterTable
ALTER TABLE "ColumnValue" ADD COLUMN     "columnId" TEXT;

-- AddForeignKey
ALTER TABLE "ColumnValue" ADD CONSTRAINT "ColumnValue_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE SET NULL ON UPDATE CASCADE;
