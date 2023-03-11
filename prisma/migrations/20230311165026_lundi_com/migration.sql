-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "itemId" TEXT;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
