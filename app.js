// desarrollo local

import express from 'express'
import { sequelize } from './config/mysql.database.js'
import { routesOfClients } from './routes/client.routes.js'
import { routesOfProducts } from './routes/product.routes.js'
import { routesOfInvoices } from './routes/invoice.routes.js'
import { corsMiddleware } from './middlewares/cors.middleware.js'

const app = express()
const PORT = process.env.PORT ?? 3000

try {
  await sequelize.sync({ force: false })
  console.log('Database connected')
} catch (error) {
  console.error('Error connecting your database.', error)
}

app.use(express.json())
app.use(corsMiddleware)

app.use('/api', routesOfClients)
app.use('/api', routesOfProducts)
app.use('/api', routesOfInvoices)

app.get('/', (req, res) => {
  res.send('Hola vercel')
})

app.listen(PORT, () => {
  console.log('Your server is running')
})
