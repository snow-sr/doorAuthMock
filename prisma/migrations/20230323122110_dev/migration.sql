/*
  Warnings:

  - You are about to drop the `RFID` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RFID";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "rfidTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rfid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastTimeUsed" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "rfidTag_rfid_key" ON "rfidTag"("rfid");
