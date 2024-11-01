-- CreateTable
CREATE TABLE "ip" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" INTEGER,

    CONSTRAINT "ip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ip_ip_key" ON "ip"("ip");

-- AddForeignKey
ALTER TABLE "ip" ADD CONSTRAINT "ip_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
