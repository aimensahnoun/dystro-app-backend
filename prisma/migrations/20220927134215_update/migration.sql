/*
  Warnings:

  - You are about to drop the column `onwer_id` on the `Company` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'company',
    "is_profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Company_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("created_at", "currency", "id", "is_profile_complete", "name", "type") SELECT "created_at", "currency", "id", "is_profile_complete", "name", "type" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_id_key" ON "Company"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
