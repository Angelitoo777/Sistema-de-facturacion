import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hola vercel')
})

app.listen(PORT, () => {
  console.log('Your server is running')
})
