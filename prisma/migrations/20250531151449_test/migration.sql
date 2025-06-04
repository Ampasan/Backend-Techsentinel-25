/*
  Warnings:

  - You are about to drop the column `description` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `icon_category` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `image_comparison` on the `comparison` table. All the data in the column will be lost.
  - You are about to drop the column `key_spec` on the `comparison` table. All the data in the column will be lost.
  - You are about to drop the column `value_spec` on the `comparison` table. All the data in the column will be lost.
  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `brand` to the `technology` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_tech` to the `technology` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `technology` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `technology` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review` to the `technology` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specs` to the `technology` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_id_tech_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_id_user_fkey";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "description",
DROP COLUMN "icon_category";

-- AlterTable
ALTER TABLE "comparison" DROP COLUMN "image_comparison",
DROP COLUMN "key_spec",
DROP COLUMN "value_spec";

-- AlterTable
ALTER TABLE "technology" ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "description_tech" TEXT NOT NULL,
ADD COLUMN     "id_user" TEXT NOT NULL,
ADD COLUMN     "rating" DECIMAL(2,1) NOT NULL,
ADD COLUMN     "review" TEXT NOT NULL,
ADD COLUMN     "reviews" JSONB,
ADD COLUMN     "specs" JSONB NOT NULL,
ADD COLUMN     "tech_image" TEXT;

-- DropTable
DROP TABLE "review";

-- CreateTable
CREATE TABLE "article" (
    "id_article" TEXT NOT NULL,
    "id_tech" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "title_article" TEXT NOT NULL,
    "description_article" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "article_pkey" PRIMARY KEY ("id_article")
);

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_id_tech_fkey" FOREIGN KEY ("id_tech") REFERENCES "technology"("id_tech") ON DELETE RESTRICT ON UPDATE CASCADE;
