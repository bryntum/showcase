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
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    name: 'North Regional Food Hub',
    address: '456 Cold Storage Lane, North City, 67890',
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    name: 'South Fresh Food Center',
    address: '789 Refrigeration Road, South Town, 54321',
    lat: 40.7128,
    lng: -74.0060,
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
  },
  {
    name: 'James Brown',
  },
  {
    name: 'Emily White',
  },
  {
    name: 'Michael Davis',
  },
  {
    name: 'Olivia Martinez',
  },
  {
    name: 'William Miller',
  },
  {
    name: 'Sophia Wilson',
  },
]

const clientData: Prisma.ClientCreateInput[] = [
  {
    name: 'Fresh Market Supermarket',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Organic Foods Co-op',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Gourmet Restaurant Chain',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'School District Food Services',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Urban Health Food Market',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Corporate Cafeteria Services',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Luxury Hotel Chain',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Regional Hospital Network',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Airport Food Services',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'University Dining Services',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Premium Catering Company',
    lat: 40.7128,
    lng: -74.001,
  }
]

const sellerData: Prisma.SellerCreateInput[] = [
  {
    name: 'Local Organic Farms',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Seafood Distributors Inc',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Dairy Producers Co-op',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Fresh Produce Imports',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Sustainable Meat Producers',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Artisanal Bakery Network',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Organic Dairy Collective',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Specialty Coffee Importers',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Local Fishermen Cooperative',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Premium Wine & Spirits Distributor',
    lat: 40.7128,
    lng: -74.001,
  },
  {
    name: 'Organic Grain Farmers Association',
    lat: 40.7128,
    lng: -74.001,
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
  },
  {
    name: 'Organic Chicken Breast',
    description: 'Free-range organic chicken breast, vacuum sealed',
    buyPrice: 800,
    sellPrice: 1200,
    currency: 'USD',
    weight: 1000,
  },
  {
    name: 'Artisanal Cheese Selection',
    description: 'Assorted premium cheeses from local dairies',
    buyPrice: 1200,
    sellPrice: 1800,
    currency: 'USD',
    weight: 800,
  },
  {
    name: 'Fresh Berries Mix',
    description: 'Seasonal organic berries, temperature controlled',
    buyPrice: 600,
    sellPrice: 900,
    currency: 'USD',
    weight: 500,
  },
  {
    name: 'Whole Grain Bread',
    description: 'Freshly baked organic whole grain bread',
    buyPrice: 250,
    sellPrice: 350,
    currency: 'USD',
    weight: 800,
  },
  {
    name: 'Premium Ground Coffee',
    description: 'Fair-trade organic coffee beans, freshly ground',
    buyPrice: 900,
    sellPrice: 1400,
    currency: 'USD',
    weight: 1000,
  },
  {
    name: 'Organic Eggs',
    description: 'Free-range organic eggs, 30-count pack',
    buyPrice: 450,
    sellPrice: 650,
    currency: 'USD',
    weight: 1500,
  },
  {
    name: 'Fresh Seafood Mix',
    description: 'Assorted fresh seafood, temperature controlled',
    buyPrice: 1800,
    sellPrice: 2500,
    currency: 'USD',
    weight: 1000,
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
        durationInMinutes: 240,
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
        durationInMinutes: 120,
        itemId: items[1].id,
        vehicleId: vehicles[1].id,
        driverId: drivers[1].id,
        clientId: clients[2].id,
        sellerId: sellers[1].id,
        comment: 'Urgent delivery to Gourmet Restaurant',
      },
      {
        type: 'SPECIAL',
        plannedFrom: new Date(`${today}T14:00:00Z`),
        actualFrom: new Date(`${today}T14:00:00Z`),
        durationInMinutes: 180,
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
        durationInMinutes: 120,
        itemId: items[3].id,
        vehicleId: null,
        driverId: null,
        clientId: clients[3].id,
        sellerId: sellers[3].id,
        comment: 'Regular delivery to School District',
      },
      {
        type: 'URGENT',
        plannedFrom: new Date(`${today}T08:30:00Z`),
        actualFrom: new Date(`${today}T08:30:00Z`),
        durationInMinutes: 90,
        itemId: items[4].id,
        vehicleId: vehicles[0].id,
        driverId: drivers[3].id,
        clientId: clients[4].id,
        sellerId: sellers[4].id,
        comment: 'Urgent delivery of fresh chicken to hotel kitchen',
      },
      {
        type: 'SPECIAL',
        plannedFrom: new Date(`${today}T10:00:00Z`),
        actualFrom: new Date(`${today}T10:15:00Z`),
        durationInMinutes: 150,
        itemId: items[5].id,
        vehicleId: vehicles[1].id,
        driverId: drivers[4].id,
        clientId: clients[5].id,
        sellerId: sellers[5].id,
        comment: 'Special delivery of premium cheese selection for hospital cafeteria',
      },
      {
        type: 'REGULAR',
        plannedFrom: new Date(`${today}T07:00:00Z`),
        actualFrom: new Date(`${today}T07:00:00Z`),
        durationInMinutes: 180,
        itemId: items[6].id,
        vehicleId: vehicles[2].id,
        driverId: drivers[5].id,
        clientId: clients[6].id,
        sellerId: sellers[6].id,
        comment: 'Early morning delivery of fresh berries for airport restaurants',
      },
      {
        type: 'URGENT',
        plannedFrom: new Date(`${today}T14:30:00Z`),
        actualFrom: new Date(`${today}T14:30:00Z`),
        durationInMinutes: 60,
        itemId: items[7].id,
        vehicleId: vehicles[3].id,
        driverId: drivers[6].id,
        clientId: clients[7].id,
        sellerId: sellers[7].id,
        comment: 'Urgent bread delivery for university dining hall',
      },
      {
        type: 'REGULAR',
        plannedFrom: new Date(`${today}T09:00:00Z`),
        actualFrom: new Date(`${today}T09:00:00Z`),
        durationInMinutes: 120,
        itemId: items[8].id,
        vehicleId: vehicles[0].id,
        driverId: drivers[7].id,
        clientId: clients[8].id,
        sellerId: sellers[8].id,
        comment: 'Regular coffee delivery for catering service',
      },
      {
        type: 'SPECIAL',
        plannedFrom: new Date(`${today}T11:00:00Z`),
        actualFrom: null,
        durationInMinutes: 90,
        itemId: items[9].id,
        vehicleId: null,
        driverId: null,
        clientId: clients[9].id,
        sellerId: sellers[9].id,
        comment: 'Scheduled delivery of organic eggs to health food market',
      },
      {
        type: 'URGENT',
        plannedFrom: new Date(`${today}T15:30:00Z`),
        actualFrom: new Date(`${today}T15:30:00Z`),
        durationInMinutes: 120,
        itemId: items[10].id,
        vehicleId: vehicles[1].id,
        driverId: drivers[8].id,
        clientId: clients[10].id,
        sellerId: sellers[10].id,
        comment: 'Late afternoon seafood delivery for corporate cafeteria',
      }
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
