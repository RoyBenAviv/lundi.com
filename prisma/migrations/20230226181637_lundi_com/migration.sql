-- AlterTable
ALTER TABLE "Boards" ADD COLUMN     "workspaceId" TEXT;

-- AddForeignKey
ALTER TABLE "Boards" ADD CONSTRAINT "Boards_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
