/*
  Warnings:

  - The primary key for the `issues` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `issues` table. All the data in the column will be lost.
  - The primary key for the `lists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `lists` table. All the data in the column will be lost.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `projects` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `users` table. All the data in the column will be lost.
  - The required column `id` was added to the `issues` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `lists` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `projects` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_list_id_fkey";

-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "lists_project_id_fkey";

-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "lists_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_fkey";

-- AlterTable
ALTER TABLE "issues" DROP CONSTRAINT "issues_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "issues_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "lists" DROP CONSTRAINT "lists_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "lists_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
