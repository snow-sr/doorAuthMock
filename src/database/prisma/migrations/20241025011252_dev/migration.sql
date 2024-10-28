-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_rfid_id_fkey";

-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_user_id_fkey";

-- AlterTable
ALTER TABLE "logs" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "rfid_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_rfid_id_fkey" FOREIGN KEY ("rfid_id") REFERENCES "rfidTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
