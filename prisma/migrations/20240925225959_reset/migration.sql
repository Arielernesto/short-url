/*
  Warnings:

  - You are about to drop the `AuthLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `shortUrl` on the `Link` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AuthLink_shortUrl_key";

-- DropIndex
DROP INDEX "AuthLink_url_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AuthLink";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL DEFAULT '0',
    "url" TEXT NOT NULL
);
INSERT INTO "new_Link" ("id", "url") SELECT "id", "url" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
