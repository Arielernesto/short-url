/*
  Warnings:

  - Added the required column `userId` to the `AuthLink` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL
);
INSERT INTO "new_AuthLink" ("id", "shortUrl", "url") SELECT "id", "shortUrl", "url" FROM "AuthLink";
DROP TABLE "AuthLink";
ALTER TABLE "new_AuthLink" RENAME TO "AuthLink";
CREATE UNIQUE INDEX "AuthLink_url_key" ON "AuthLink"("url");
CREATE UNIQUE INDEX "AuthLink_shortUrl_key" ON "AuthLink"("shortUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
