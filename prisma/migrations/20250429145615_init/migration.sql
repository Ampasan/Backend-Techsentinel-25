/*
  Warnings:

  - You are about to drop the column `description` on the `technology` table. All the data in the column will be lost.
  - Added the required column `description` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "technology" DROP COLUMN "description";
