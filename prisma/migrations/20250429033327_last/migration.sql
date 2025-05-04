/*
  Warnings:

  - You are about to drop the column `image_tech` on the `comparison` table. All the data in the column will be lost.
  - Added the required column `image_comparison` to the `comparison` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comparison" DROP COLUMN "image_tech",
ADD COLUMN     "image_comparison" TEXT NOT NULL;
