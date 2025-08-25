import app from "./app";
import { prisma } from "./config/db";
import { PORT } from "./config/env";



async function startServer() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📚 Environment: ${process.env.NODE_ENV}`)
      console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...')
  await prisma.$disconnect()
  process.exit(0)
})

startServer();