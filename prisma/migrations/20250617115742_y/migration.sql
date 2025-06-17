-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VehicleAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT,
    "trailerId" TEXT,
    "driverId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VehicleAssignment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VehicleAssignment_trailerId_fkey" FOREIGN KEY ("trailerId") REFERENCES "Trailer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VehicleAssignment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VehicleAssignment" ("createdAt", "date", "driverId", "id", "trailerId", "updatedAt", "vehicleId") SELECT "createdAt", "date", "driverId", "id", "trailerId", "updatedAt", "vehicleId" FROM "VehicleAssignment";
DROP TABLE "VehicleAssignment";
ALTER TABLE "new_VehicleAssignment" RENAME TO "VehicleAssignment";
CREATE INDEX "VehicleAssignment_date_idx" ON "VehicleAssignment"("date");
CREATE UNIQUE INDEX "VehicleAssignment_vehicleId_trailerId_date_key" ON "VehicleAssignment"("vehicleId", "trailerId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
