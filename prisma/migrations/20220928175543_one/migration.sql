/*
  Warnings:

  - A unique constraint covering the columns `[owner_id]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Company_owner_id_key" ON "Company"("owner_id");
