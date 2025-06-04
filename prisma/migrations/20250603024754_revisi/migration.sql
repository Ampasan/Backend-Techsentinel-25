/*
  Warnings:

  - You are about to drop the column `reviews` on the `technology` table. All the data in the column will be lost.
  - You are about to drop the column `specs` on the `technology` table. All the data in the column will be lost.
  - Added the required column `compared_with` to the `comparison` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "icon_category" TEXT;

-- AlterTable
ALTER TABLE "comparison" ADD COLUMN     "compared_with" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "technology" DROP COLUMN "reviews",
DROP COLUMN "specs";

-- CreateTable
CREATE TABLE "review" (
    "id_review" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_tech" TEXT NOT NULL,
    "rating" DECIMAL(2,1) NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "review_pkey" PRIMARY KEY ("id_review")
);

-- CreateTable
CREATE TABLE "spec" (
    "id_spec" TEXT NOT NULL,
    "id_tech" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "baterai" TEXT NOT NULL,
    "camera" TEXT NOT NULL,
    "prosesor" TEXT NOT NULL,
    "sistem_operasi" TEXT NOT NULL,
    "ukuran_layar" TEXT NOT NULL,
    "resolusi_layar" TEXT NOT NULL,
    "refresh_rate" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "spec_pkey" PRIMARY KEY ("id_spec")
);

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_id_tech_fkey" FOREIGN KEY ("id_tech") REFERENCES "technology"("id_tech") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spec" ADD CONSTRAINT "spec_id_tech_fkey" FOREIGN KEY ("id_tech") REFERENCES "technology"("id_tech") ON DELETE RESTRICT ON UPDATE CASCADE;
