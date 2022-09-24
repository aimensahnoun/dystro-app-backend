/*
  Warnings:

  - You are about to drop the column `password` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `hash` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Auth" ("email", "id") SELECT "email", "id" FROM "Auth";
DROP TABLE "Auth";
ALTER TABLE "new_Auth" RENAME TO "Auth";
CREATE UNIQUE INDEX "Auth_id_key" ON "Auth"("id");
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
