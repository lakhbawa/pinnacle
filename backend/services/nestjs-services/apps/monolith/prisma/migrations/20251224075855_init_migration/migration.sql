/*
  Warnings:

  - You are about to drop the column `order` on the `issues` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `lists` table. All the data in the column will be lost.
  - Added the required column `position` to the `issues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `lists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "issues" DROP COLUMN "order",
ADD COLUMN     "position" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lists" DROP COLUMN "order",
ADD COLUMN     "position" TEXT NOT NULL;
