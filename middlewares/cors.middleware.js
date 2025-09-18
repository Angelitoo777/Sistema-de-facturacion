import cors from 'cors'

const corsOptions = {
  origin: ['https://sistema-de-facturacion-eight.vercel.app', 'http://localhost:3000', 'https://my-billing-app-tan.vercel.app/'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

export const corsMiddleware = cors(corsOptions)
