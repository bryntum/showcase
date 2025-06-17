/*
  Warnings:

  - You are about to drop the column `trailerId` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `trailerId` to the `VehicleAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "VINNumber" TEXT,
    "depotId" TEXT NOT NULL,
    "model" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vehicle_depotId_fkey" FOREIGN KEY ("depotId") REFERENCES "Depot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehicle" ("VINNumber", "createdAt", "depotId", "id", "model", "name", "updatedAt") SELECT "VINNumber", "createdAt", "depotId", "id", "model", "name", "updatedAt" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
CREATE TABLE "new_VehicleAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "trailerId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VehicleAssignment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VehicleAssignment_trailerId_fkey" FOREIGN KEY ("trailerId") REFERENCES "Trailer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VehicleAssignment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VehicleAssignment" ("createdAt", "date", "driverId", "id", "updatedAt", "vehicleId") SELECT "createdAt", "date", "driverId", "id", "updatedAt", "vehicleId" FROM "VehicleAssignment";
DROP TABLE "VehicleAssignment";
ALTER TABLE "new_VehicleAssignment" RENAME TO "VehicleAssignment";
CREATE INDEX "VehicleAssignment_date_idx" ON "VehicleAssignment"("date");
CREATE UNIQUE INDEX "VehicleAssignment_vehicleId_date_key" ON "VehicleAssignment"("vehicleId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
