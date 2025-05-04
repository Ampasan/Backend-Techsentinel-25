/*
  Warnings:

  - Added the required column `image_tech` to the `comparison` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comparison" ADD COLUMN     "image_tech" TEXT NOT NULL;
