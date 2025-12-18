/*
  Warnings:

  - You are about to drop the `board` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "board";

-- CreateTable
CREATE TABLE "projects" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "lists" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
