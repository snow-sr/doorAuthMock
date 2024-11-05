-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "message" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';
