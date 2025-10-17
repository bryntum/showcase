import { PrismaClient } from "@prisma/client";
import { userData, depotData, driverData, clientData, sellerData, itemData } from "./seed-data";

export const clearDatabase = async (prisma: PrismaClient) => {
  console.log("Clearing database...");
  await prisma.delivery.deleteMany();
  await prisma.item.deleteMany();
  await prisma.vehicleAssignment.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.trailer.deleteMany();
  await prisma.depot.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.client.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleared.");
};

export const createUsers = async (prisma: PrismaClient) => {
  const users = [];
  for (const user of userData) {
    const createdUser = await prisma.user.create({ data: user });
    users.push(createdUser);
  }
  console.log("Created users");
  return users;
};

export const createDepots = async (prisma: PrismaClient) => {
  const depots = [];
  for (const depot of depotData) {
    const createdDepot = await prisma.depot.create({ data: depot });
    depots.push(createdDepot);
  }
  console.log("Created depots");
  return depots;
};

export const createVehicles = async (prisma: PrismaClient, depots: any[]) => {
  const vehicles = [];
  for (let i = 0; i < 4; i++) {
    const refrigeratedVehicle = await prisma.vehicle.create({
      data: {
        name: `Refrigerated Truck ${String(i + 1).padStart(3, "0")}`,
        VINNumber: `RF-${String(i + 1).padStart(3, "0")}-ABC`,
        model: Math.random() > 0.5 ? "DAF XF" : "Mercedes-Benz Actros",
        depot: { connect: { id: depots[i % depots.length].id } },
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        name: `Truck ${String(i + 1).padStart(3, "0")}`,
        VINNumber: `NT-${String(i + 1).padStart(3, "0")}-XYZ`,
        model: Math.random() > 0.5 ? "Volvo FH" : "Scania R500",
        depot: { connect: { id: depots[i % depots.length].id } },
      },
    });

    vehicles.push(refrigeratedVehicle);
    vehicles.push(vehicle);
  }
  console.log("Created vehicles");
  return vehicles;
};

export const createTrailers = async (prisma: PrismaClient, depots: any[]) => {
  const trailers = [];
  for (let i = 0; i < 4; i++) {
    const tankerTrailer = await prisma.trailer.create({
      data: {
        name: `Tanker ${String(i + 1).padStart(3, "0")}`,
        VINNumber: `TR-${String(999 - i).padStart(3, "0")}-DEF`,
        depot: { connect: { id: depots[i % depots.length].id } },
        capacity: Math.random() > 0.5 ? 10000 : 20000,
        capacityUnit: "L",
      },
    });

    const dryVanTrailer = await prisma.trailer.create({
      data: {
        name: `Dry Van ${String(i + 1).padStart(3, "0")}`,
        VINNumber: `DV-${String(999 - i).padStart(3, "0")}-UVW`,
        capacity: Math.random() > 0.5 ? 10000 : 20000,
        capacityUnit: "kg",
        depot: { connect: { id: depots[i % depots.length].id } },
      },
    });

    trailers.push(tankerTrailer);
    trailers.push(dryVanTrailer);
  }
  console.log("Created trailers");
  return trailers;
};

export const createDrivers = async (prisma: PrismaClient) => {
  const drivers = [];
  for (const driver of driverData) {
    const createdDriver = await prisma.driver.create({ data: driver });
    drivers.push(createdDriver);
  }
  console.log("Created drivers");
  return drivers;
};

export const createVehicleAssignments = async (prisma: PrismaClient, vehicles: any[], drivers: any[], trailers: any[], today: string) => {
  const vehicleAssignments = [];
  for (let i = 0; i < 4; i++) {
    const refrigeratedAssignment = await prisma.vehicleAssignment.create({
      data: {
        vehicleId: vehicles[i % vehicles.length].id,
        driverId: drivers[i % drivers.length].id,
        trailerId: trailers[i % trailers.length].id,
        date: `${today}T12:00:00Z`,
      },
    });
    vehicleAssignments.push(refrigeratedAssignment);
  }
  console.log("Created vehicle assignments");
  return vehicleAssignments;
};

export const createClients = async (prisma: PrismaClient) => {
  const clients = [];
  for (const client of clientData) {
    const createdClient = await prisma.client.create({ data: client });
    clients.push(createdClient);
  }
  console.log("Created clients");
  return clients;
};

export const createSellers = async (prisma: PrismaClient) => {
  const sellers = [];
  for (const seller of sellerData) {
    const createdSeller = await prisma.seller.create({ data: seller });
    sellers.push(createdSeller);
  }
  console.log("Created sellers");
  return sellers;
};

export const createItems = async (prisma: PrismaClient) => {
  const items = [];
  for (const item of itemData) {
    const createdItem = await prisma.item.create({ data: item });
    items.push(createdItem);
  }
  console.log("Created items");
  return items;
};

export const createDeliveries = async (prisma: PrismaClient, items: any[], drivers: any[], clients: any[], sellers: any[], today: string) => {
  const deliveries = [
    { type: "REGULAR", plannedFrom: new Date(`${today}T06:00:00Z`), actualFrom: new Date(`${today}T06:00:00Z`), durationInMinutes: 240, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[0].id, driverId: drivers[0].id, clientId: clients[0].id, sellerId: sellers[0].id, comment: "Regular delivery to Fresh Market" },
    { type: "SPECIAL", plannedFrom: new Date(`${today}T09:00:00Z`), actualFrom: new Date(`${today}T11:00:00Z`), durationInMinutes: 120, preambleInMinutes: 60, postambleInMinutes: 60, itemId: items[10].id, driverId: drivers[0].id, clientId: clients[10].id, sellerId: sellers[10].id, comment: "Special delivery to Gourmet Restaurant" },
    { type: "URGENT", plannedFrom: new Date(`${today}T12:00:00Z`), actualFrom: new Date(`${today}T12:00:00Z`), durationInMinutes: 120, preambleInMinutes: 45, postambleInMinutes: 45, itemId: items[1].id, driverId: drivers[1].id, clientId: clients[2].id, sellerId: sellers[1].id, comment: "Urgent delivery to Gourmet Restaurant" },
    { type: "REGULAR", plannedFrom: new Date(`${today}T15:00:00Z`), actualFrom: new Date(`${today}T15:00:00Z`), durationInMinutes: 60, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[9].id, driverId: drivers[1].id, clientId: clients[9].id, sellerId: sellers[9].id, comment: "Regular delivery to School District" },
    { type: "SPECIAL", plannedFrom: new Date(`${today}T14:00:00Z`), actualFrom: new Date(`${today}T14:00:00Z`), durationInMinutes: 180, preambleInMinutes: 60, postambleInMinutes: 60, itemId: items[2].id, driverId: drivers[2].id, clientId: clients[1].id, sellerId: sellers[2].id, comment: "Scheduled delivery to Organic Foods Co-op" },
    { type: "SPECIAL", plannedFrom: new Date(`${today}T08:00:00Z`), actualFrom: new Date(`${today}T09:00:00Z`), durationInMinutes: 180, preambleInMinutes: 60, postambleInMinutes: 60, itemId: items[8].id, driverId: drivers[2].id, clientId: clients[8].id, sellerId: sellers[8].id, comment: "Scheduled delivery to Gourmet Restaurant" },
    { type: "REGULAR", plannedFrom: new Date(`${today}T12:00:00Z`), actualFrom: null, durationInMinutes: 120, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[3].id, driverId: null, clientId: clients[3].id, sellerId: sellers[3].id, comment: "Regular delivery to School District" },
    { type: "URGENT", plannedFrom: new Date(`${today}T14:00:00Z`), actualFrom: null, durationInMinutes: 150, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[3].id, driverId: null, clientId: clients[3].id, sellerId: sellers[3].id, comment: "Urgent delivery to School District" },
    { type: "URGENT", plannedFrom: new Date(`${today}T08:30:00Z`), actualFrom: new Date(`${today}T08:30:00Z`), durationInMinutes: 90, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[4].id, driverId: drivers[3].id, clientId: clients[4].id, sellerId: sellers[4].id, comment: "Urgent delivery of fresh chicken to hotel kitchen" },
    { type: "SPECIAL", plannedFrom: new Date(`${today}T14:30:00Z`), actualFrom: new Date(`${today}T14:00:00Z`), durationInMinutes: 120, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[7].id, driverId: drivers[3].id, clientId: clients[7].id, sellerId: sellers[7].id, comment: "Urgent delivery of fresh berries to airport" },
    { type: "SPECIAL", plannedFrom: new Date(`${today}T10:00:00Z`), actualFrom: new Date(`${today}T10:15:00Z`), durationInMinutes: 150, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[5].id, driverId: drivers[4].id, clientId: clients[5].id, sellerId: sellers[5].id, comment: "Special delivery of premium cheese selection for hospital cafeteria" },
    { type: "REGULAR", plannedFrom: new Date(`${today}T15:00:00Z`), actualFrom: new Date(`${today}T15:15:00Z`), durationInMinutes: 120, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[6].id, driverId: drivers[4].id, clientId: clients[6].id, sellerId: sellers[6].id, comment: "Special delivery of premium cheese selection for hospital cafeteria" },
    { type: "REGULAR", plannedFrom: new Date(`${today}T07:00:00Z`), actualFrom: new Date(`${today}T07:00:00Z`), durationInMinutes: 180, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[6].id, driverId: drivers[5].id, clientId: clients[6].id, sellerId: sellers[6].id, comment: "Early morning delivery of fresh berries for airport restaurants" },
    { type: "URGENT", plannedFrom: new Date(`${today}T14:30:00Z`), actualFrom: new Date(`${today}T14:30:00Z`), durationInMinutes: 60, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[7].id, driverId: drivers[6].id, clientId: clients[7].id, sellerId: sellers[7].id, comment: "Urgent bread delivery for university dining hall" },
    { type: "REGULAR", plannedFrom: new Date(`${today}T09:00:00Z`), actualFrom: new Date(`${today}T09:00:00Z`), durationInMinutes: 120, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[8].id, driverId: drivers[7].id, clientId: clients[8].id, sellerId: sellers[8].id, comment: "Regular coffee delivery for catering service" },
    { type: "SPECIAL", plannedFrom: new Date(`${today}T11:00:00Z`), actualFrom: null, durationInMinutes: 90, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[9].id, driverId: null, clientId: clients[9].id, sellerId: sellers[9].id, comment: "Scheduled delivery of organic eggs to health food market" },
    { type: "URGENT", plannedFrom: new Date(`${today}T15:30:00Z`), actualFrom: new Date(`${today}T15:30:00Z`), durationInMinutes: 120, preambleInMinutes: 30, postambleInMinutes: 30, itemId: items[10].id, driverId: drivers[8].id, clientId: clients[10].id, sellerId: sellers[10].id, comment: "Late afternoon seafood delivery for corporate cafeteria" },
  ];

  for (const delivery of deliveries) {
    await prisma.delivery.create({ data: delivery });
  }
  console.log("Created deliveries");
};

export const runSeed = async (prisma: PrismaClient) => {
  try {
    const today = new Date().toISOString().substring(0, 10);
    await clearDatabase(prisma);
    console.log("Start seeding...");

    await createUsers(prisma);
    const depots = await createDepots(prisma);
    const vehicles = await createVehicles(prisma, depots);
    const trailers = await createTrailers(prisma, depots);
    const drivers = await createDrivers(prisma);
    await createVehicleAssignments(prisma, vehicles, drivers, trailers, today);
    const clients = await createClients(prisma);
    const sellers = await createSellers(prisma);
    const items = await createItems(prisma);
    await createDeliveries(prisma, items, drivers, clients, sellers, today);

    console.log("Seeding finished successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
};
