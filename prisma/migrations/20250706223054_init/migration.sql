-- CreateEnum
CREATE TYPE "Status" AS ENUM ('accept', 'reject', 'pending');

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);
