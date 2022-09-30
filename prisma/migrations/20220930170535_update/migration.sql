-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TOTP" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TOTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TOTP" ("created_at", "id", "token", "user_id") SELECT "created_at", "id", "token", "user_id" FROM "TOTP";
DROP TABLE "TOTP";
ALTER TABLE "new_TOTP" RENAME TO "TOTP";
CREATE UNIQUE INDEX "TOTP_id_key" ON "TOTP"("id");
CREATE UNIQUE INDEX "TOTP_user_id_key" ON "TOTP"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
