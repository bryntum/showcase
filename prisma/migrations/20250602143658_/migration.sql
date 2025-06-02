/*
  Warnings:

  - Added the required column `lat` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Depot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Depot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL
);
INSERT INTO "new_Client" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE TABLE "new_Depot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL
);
INSERT INTO "new_Depot" ("address", "createdAt", "id", "name", "updatedAt") SELECT "address", "createdAt", "id", "name", "updatedAt" FROM "Depot";
DROP TABLE "Depot";
ALTER TABLE "new_Depot" RENAME TO "Depot";
CREATE TABLE "new_Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL
);
INSERT INTO "new_Seller" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
