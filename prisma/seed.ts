import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@bryntum.com',
  },
  {
    name: 'Bob',
    email: 'bob@bryntum.com',
  }
]

const depotData: Prisma.DepotCreateInput[] = [
  {
    name: 'Central Food Distribution Center',
    address: '123 Logistics Park, Food Valley, 12345',
  },
  {
    name: 'North Regional Food Hub',
    address: '456 Cold Storage Lane, North City, 67890',
  },
  {
    name: 'South Fresh Food Center',
    address: '789 Refrigeration Road, South Town, 54321',
  }
]

const driverData: Prisma.DriverCreateInput[] = [
  {
    name: 'John Smith',
  },
  {
    name: 'Maria Garcia',
  },
  {
    name: 'David Chen',
  },
  {
    name: 'Sarah Johnson',
  }
]

const clientData: Prisma.ClientCreateInput[] = [
  {
    name: 'Fresh Market Supermarket',
  },
  {
    name: 'Organic Foods Co-op',
  },
  {
    name: 'Gourmet Restaurant Chain',
  },
  {
    name: 'School District Food Services',
  }
]

const sellerData: Prisma.SellerCreateInput[] = [
  {
    name: 'Local Organic Farms',
  },
  {
    name: 'Seafood Distributors Inc',
  },
  {
    name: 'Dairy Producers Co-op',
  },
  {
    name: 'Fresh Produce Imports',
  }
]

const itemData: Prisma.ItemCreateInput[] = [
  {
    name: 'Organic Apples',
    description: 'Fresh organic apples from local farms',
    buyPrice: 200,
    sellPrice: 300,
    currency: 'USD',
    weight: 1000,
  },
  {
    name: 'Fresh Salmon',
    description: 'Premium grade salmon, temperature controlled',
    buyPrice: 1500,
    sellPrice: 2000,
    currency: 'USD',
    weight: 500,
  },
  {
    name: 'Organic Milk',
    description: 'Pasteurized organic whole milk',
    buyPrice: 300,
    sellPrice: 400,
    currency: 'USD',
    weight: 2000,
  },
  {
    name: 'Fresh Vegetables Mix',
    description: 'Assorted seasonal vegetables',
    buyPrice: 400,
    sellPrice: 600,
    currency: 'USD',
    weight: 1500,
  }
]

const clearDatabase = async () => {
  console.log('Clearing database...')

  // Delete in reverse order of dependencies
  await prisma.delivery.deleteMany()
  await prisma.item.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.depot.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.client.deleteMany()
  await prisma.seller.deleteMany()
  await prisma.user.deleteMany()

  console.log('Database cleared.')
}

const main = async () => {
  try {
    // Clear the database first
    await clearDatabase()

    console.log('Start seeding...')

    // Create users
    const users = []
    for (const user of userData) {
      const createdUser = await prisma.user.create({ data: user })
      users.push(createdUser)
    }
    console.log('Created users')

    // Create depots
    const depots = []
    for (const depot of depotData) {
      const createdDepot = await prisma.depot.create({ data: depot })
      depots.push(createdDepot)
    }
    console.log('Created depots')

    // Create vehicles with proper depot connections
    const vehicles = []
    for (let i = 0; i < 4; i++) {
      const vehicle = await prisma.vehicle.create({
        data: {
          name: `Refrigerated Truck ${String(i + 1).padStart(3, '0')}`,
          VINNumber: `RF${String(i + 1).padStart(3, '0')}XYZ`,
          depot: { connect: { id: depots[i % depots.length].id } },
        },
      })
      vehicles.push(vehicle)
    }
    console.log('Created vehicles')

    // Create drivers
    const drivers = []
    for (const driver of driverData) {
      const createdDriver = await prisma.driver.create({ data: driver })
      drivers.push(createdDriver)
    }
    console.log('Created drivers')

    // Create clients
    const clients = []
    for (const client of clientData) {
      const createdClient = await prisma.client.create({ data: client })
      clients.push(createdClient)
    }
    console.log('Created clients')

    // Create sellers
    const sellers = []
    for (const seller of sellerData) {
      const createdSeller = await prisma.seller.create({ data: seller })
      sellers.push(createdSeller)
    }
    console.log('Created sellers')

    // Create items
    const items = []
    for (const item of itemData) {
      const createdItem = await prisma.item.create({ data: item })
      items.push(createdItem)
    }
    console.log('Created items')

    const today = new Date().toISOString().substring(0, 10);

    // Create deliveries with proper connections
    const deliveries = [
      {
        type: 'REGULAR',
        plannedFrom: new Date(`${today}T05:00:00Z`),
        actualFrom: new Date(`${today}T05:00:00Z`),
        plannedTo: new Date(`${today}T07:00:00Z`),
        actualTo: new Date(`${today}T07:00:00Z`),
        itemId: items[0].id,
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        clientId: clients[0].id,
        sellerId: sellers[0].id,
        comment: 'Regular delivery to Fresh Market',
      },
      {
        type: 'URGENT',
        plannedFrom: new Date(`${today}T12:00:00Z`),
        actualFrom: new Date(`${today}T12:00:00Z`),
        plannedTo: new Date(`${today}T14:00:00Z`),
        actualTo: new Date(`${today}T14:00:00Z`),
        itemId: items[1].id,
        vehicleId: vehicles[1].id,
        driverId: drivers[1].id,
        clientId: clients[2].id,
        sellerId: sellers[1].id,
        comment: 'Urgent delivery to Gourmet Restaurant',
      },
      {
        type: 'SCHEDULED',
        plannedFrom: new Date(`${today}T14:00:00Z`),
        actualFrom: new Date(`${today}T14:00:00Z`),
        plannedTo: new Date(`${today}T17:00:00Z`),
        actualTo: new Date(`${today}T17:00:00Z`),
        itemId: items[2].id,
        vehicleId: vehicles[2].id,
        driverId: drivers[2].id,
        clientId: clients[1].id,
        sellerId: sellers[2].id,
        comment: 'Scheduled delivery to Organic Foods Co-op',
      },
      {
        type: 'REGULAR',
        plannedFrom: new Date(`${today}T12:00:00Z`),
        actualFrom: null,
        plannedTo: new Date(`${today}T14:00:00Z`),
        actualTo: null,
        itemId: items[3].id,
        vehicleId: null,
        driverId: null,
        clientId: clients[3].id,
        sellerId: sellers[3].id,
        comment: 'Regular delivery to School District',
      },
    ]

    for (const delivery of deliveries) {
      await prisma.delivery.create({ data: delivery })
    }
    console.log('Created deliveries')

    console.log('Seeding finished successfully.')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
