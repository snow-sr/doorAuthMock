/*
  Warnings:

  - You are about to drop the column `user_id` on the `ip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ip" DROP CONSTRAINT "ip_user_id_fkey";

-- AlterTable
ALTER TABLE "ip" DROP COLUMN "user_id";
