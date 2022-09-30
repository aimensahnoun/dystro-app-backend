/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `TOTP` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TOTP_user_id_key" ON "TOTP"("user_id");
