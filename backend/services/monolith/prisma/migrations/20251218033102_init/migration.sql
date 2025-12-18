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
    "project_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "issues" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issue_type" TEXT NOT NULL DEFAULT 'task',
    "due_date" TIMESTAMP(3),
    "list_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
