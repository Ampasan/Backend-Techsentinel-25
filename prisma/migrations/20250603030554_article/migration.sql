/*
  Warnings:

  - You are about to drop the column `content` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `description_article` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `article` table. All the data in the column will be lost.
  - Added the required column `intro` to the `article` table without a default value. This is not possible if the table is not empty.
  - Made the column `icon_category` on table `category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "article" DROP COLUMN "content",
DROP COLUMN "description_article",
DROP COLUMN "thumbnail",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "intro" TEXT NOT NULL,
ADD COLUMN     "section2Content" TEXT,
ADD COLUMN     "section2Image" TEXT,
ADD COLUMN     "section2Title" TEXT,
ADD COLUMN     "subContent" TEXT,
ADD COLUMN     "subContent2" TEXT,
ADD COLUMN     "subImage" TEXT,
ADD COLUMN     "subTitle" TEXT,
ADD COLUMN     "subTitle2" TEXT;

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "icon_category" SET NOT NULL;
