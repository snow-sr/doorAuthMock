-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firebase_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfidTag" (
    "id" SERIAL NOT NULL,
    "rfid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "used_times" INTEGER NOT NULL DEFAULT 0,
    "last_time_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER,

    CONSTRAINT "rfidTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_firebase_id_key" ON "user"("firebase_id");

-- CreateIndex
CREATE UNIQUE INDEX "rfidTag_rfid_key" ON "rfidTag"("rfid");

-- AddForeignKey
ALTER TABLE "rfidTag" ADD CONSTRAINT "rfidTag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
