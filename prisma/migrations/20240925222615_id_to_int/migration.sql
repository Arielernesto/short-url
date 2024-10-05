/*
  Warnings:

  - The primary key for the `AuthLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `AuthLink` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Link` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL
);
INSERT INTO "new_AuthLink" ("id", "shortUrl", "url") SELECT "id", "shortUrl", "url" FROM "AuthLink";
DROP TABLE "AuthLink";
ALTER TABLE "new_AuthLink" RENAME TO "AuthLink";
CREATE UNIQUE INDEX "AuthLink_url_key" ON "AuthLink"("url");
CREATE UNIQUE INDEX "AuthLink_shortUrl_key" ON "AuthLink"("shortUrl");
CREATE TABLE "new_Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL
);
INSERT INTO "new_Link" ("id", "shortUrl", "url") SELECT "id", "shortUrl", "url" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");
CREATE UNIQUE INDEX "Link_shortUrl_key" ON "Link"("shortUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
