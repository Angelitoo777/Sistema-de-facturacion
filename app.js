import express from 'express'
import { sequelize } from './config/mysql.database.js'

const app = express()
const PORT = process.env.PORT ?? 3000

try {
  await sequelize.sync({ force: true })
} catch (error) {
  console.error('Error connecting your database.', error)
}

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hola vercel')
})

app.listen(PORT, () => {
  console.log('Your server is running')
})
