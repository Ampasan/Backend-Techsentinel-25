-- CreateTable
CREATE TABLE "users_level" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" TEXT NOT NULL,
    "id_level" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "profile_picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "category" (
    "id_category" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id_category")
);

-- CreateTable
CREATE TABLE "technology" (
    "id_tech" TEXT NOT NULL,
    "id_category" TEXT NOT NULL,
    "tech_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "technology_pkey" PRIMARY KEY ("id_tech")
);

-- CreateTable
CREATE TABLE "review" (
    "id_review" TEXT NOT NULL,
    "id_tech" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "title_review" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "review_pkey" PRIMARY KEY ("id_review")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id_favorite" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id_favorite")
);

-- CreateTable
CREATE TABLE "tech_favorite" (
    "id_favorite" TEXT NOT NULL,
    "id_tech" TEXT NOT NULL,

    CONSTRAINT "tech_favorite_pkey" PRIMARY KEY ("id_favorite","id_tech")
);

-- CreateTable
CREATE TABLE "comparison" (
    "id_detail" TEXT NOT NULL,
    "id_tech" TEXT NOT NULL,
    "key_spec" TEXT NOT NULL,
    "value_spec" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "comparison_pkey" PRIMARY KEY ("id_detail")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_level_name_key" ON "users_level"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "technology_tech_name_key" ON "technology"("tech_name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_level_fkey" FOREIGN KEY ("id_level") REFERENCES "users_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology" ADD CONSTRAINT "technology_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "category"("id_category") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_id_tech_fkey" FOREIGN KEY ("id_tech") REFERENCES "technology"("id_tech") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_favorite" ADD CONSTRAINT "tech_favorite_id_favorite_fkey" FOREIGN KEY ("id_favorite") REFERENCES "favorite"("id_favorite") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_favorite" ADD CONSTRAINT "tech_favorite_id_tech_fkey" FOREIGN KEY ("id_tech") REFERENCES "technology"("id_tech") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison" ADD CONSTRAINT "comparison_id_tech_fkey" FOREIGN KEY ("id_tech") REFERENCES "technology"("id_tech") ON DELETE RESTRICT ON UPDATE CASCADE;
