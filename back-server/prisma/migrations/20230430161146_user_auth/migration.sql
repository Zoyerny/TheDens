/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `OnlineUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OnlineUser" ADD COLUMN     "socketId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OnlineUser_socketId_key" ON "OnlineUser"("socketId");
