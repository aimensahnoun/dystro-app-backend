-- CreateTable
CREATE TABLE "TOTP" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "TOTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TOTP_id_key" ON "TOTP"("id");
