-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rfidTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rfid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastTimeUsed" DATETIME NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "rfidTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_rfidTag" ("createdAt", "id", "lastTimeUsed", "rfid", "updatedAt") SELECT "createdAt", "id", "lastTimeUsed", "rfid", "updatedAt" FROM "rfidTag";
DROP TABLE "rfidTag";
ALTER TABLE "new_rfidTag" RENAME TO "rfidTag";
CREATE UNIQUE INDEX "rfidTag_rfid_key" ON "rfidTag"("rfid");
CREATE UNIQUE INDEX "rfidTag_userId_key" ON "rfidTag"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
