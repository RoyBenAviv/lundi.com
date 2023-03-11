/*
  Warnings:

  - You are about to drop the column `foldersId` on the `Boards` table. All the data in the column will be lost.
  - You are about to drop the `Folders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Boards" DROP CONSTRAINT "Boards_foldersId_fkey";

-- DropForeignKey
ALTER TABLE "Folders" DROP CONSTRAINT "Folders_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Boards" DROP COLUMN "foldersId";

-- DropTable
DROP TABLE "Folders";
