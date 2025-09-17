import express from 'express'
import { initializeSequelize } from './config/mysql.database.js'
import { routesOfClients } from './routes/client.routes.js'

const app = express()
const PORT = process.env.PORT ?? 3000

try {
  const sequelize = await initializeSequelize()
  await sequelize.sync({ force: true })
} catch (error) {
  console.error('Error connecting your database.', error)
}

app.use(express.json())

app.use('/api', routesOfClients)

app.get('/', (req, res) => {
  res.send('Hola vercel')
})

app.listen(PORT, () => {
  console.log('Your server is running')
})
