/*
  Warnings:

  - You are about to drop the column `userId` on the `List` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `List` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "boardId" TEXT NOT NULL,
    CONSTRAINT "List_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_List" ("createdAt", "id", "title", "updatedAt") SELECT "createdAt", "id", "title", "updatedAt" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
