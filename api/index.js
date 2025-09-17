// produccion
import 'mysql2'
import express from 'express'
import { sequelize } from '../config/mysql.database.js'
import { routesOfClients } from '../routes/client.routes.js'
import { routesOfProducts } from '../routes/product.routes.js'

const app = express()

app.use(express.json())
app.use('/api', routesOfClients)
app.use('/api', routesOfProducts)

app.get('/', (req, res) => {
  res.send('Hola vercel')
})

export default async (req, res) => {
  try {
    await sequelize.sync()
    app(req, res)
  } catch (error) {
    console.error('Error connecting your database.', error)
    res.status(500).send('Database connection error')
  }
}
