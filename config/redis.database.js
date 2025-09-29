import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const redisDB = async () => {
  const redisClient = new Redis(REDIS_URL)
  try {
    await redisClient.ping()
    return redisClient
  } catch (error) {
    console.error('Error connecting to Redis:', error)
    throw error
  }
}
