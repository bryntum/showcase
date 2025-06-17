/*
  Warnings:

  - A unique constraint covering the columns `[vehicleId,trailerId,date]` on the table `VehicleAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VehicleAssignment_vehicleId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "VehicleAssignment_vehicleId_trailerId_date_key" ON "VehicleAssignment"("vehicleId", "trailerId", "date");
