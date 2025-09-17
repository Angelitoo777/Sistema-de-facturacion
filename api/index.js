// produccion
import 'mysql2'
import express from 'express'
import { initializeSequelize } from '../config/mysql.database.js'
import { routesOfClients } from '../routes/client.routes.js'

const app = express()

app.use(express.json())
app.use('/api', routesOfClients)

app.get('/', (req, res) => {
  res.send('Hola vercel')
})

export default async (req, res) => {
  try {
    const sequelize = await initializeSequelize()
    await sequelize.sync()
    app(req, res)
  } catch (error) {
    console.error('Error connecting your database.', error)
    res.status(500).send('Database connection error')
  }
}
