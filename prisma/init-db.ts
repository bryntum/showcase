import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

const initDatabase = async () => {
  try {
    // Verify database connection
    await prisma.$connect()
    console.log('Database connection verified.')

    // Check if we need to seed the database
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      console.log('Database is empty. Running seed script...')
      execSync('npx prisma db seed', { stdio: 'inherit' })
    } else {
      console.log('Database already contains data.')
    }

  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the initialization
initDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
