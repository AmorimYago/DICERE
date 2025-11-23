/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Child` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Child_name_key" ON "Child"("name");
