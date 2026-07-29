/*
  Warnings:

  - You are about to drop the column `warnings` on the `users` table. All the data in the column will be lost.
  - The `infractions` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "warnings",
DROP COLUMN "infractions",
ADD COLUMN     "infractions" TEXT[] DEFAULT ARRAY[]::TEXT[];
