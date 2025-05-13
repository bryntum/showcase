/*
  Warnings:

  - You are about to drop the column `actualTo` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `plannedTo` on the `Delivery` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Delivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "clientId" TEXT,
    "sellerId" TEXT,
    "type" TEXT NOT NULL,
    "plannedFrom" DATETIME,
    "actualFrom" DATETIME,
    "durationInMinutes" INTEGER,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Delivery_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Delivery_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Delivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Delivery_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Delivery_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Delivery" ("actualFrom", "clientId", "comment", "createdAt", "driverId", "id", "itemId", "plannedFrom", "sellerId", "type", "updatedAt", "vehicleId") SELECT "actualFrom", "clientId", "comment", "createdAt", "driverId", "id", "itemId", "plannedFrom", "sellerId", "type", "updatedAt", "vehicleId" FROM "Delivery";
DROP TABLE "Delivery";
ALTER TABLE "new_Delivery" RENAME TO "Delivery";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
