import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const DATABASE_NAME = process.env.DATABASE_NAME
const DATABASE_USERNAME = process.env.DATABASE_USERNAME
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE_HOST = process.env.DATABASE_HOST
const DATABASE_PORT = process.env.DATABASE_PORT
const DB_CA_CERT = process.env.DB_CA_CERT

// Configuración síncrona para exportar sequelize y permitir autocompletado

const sequelizeOptions = {
  host: DATABASE_HOST,
  port: DATABASE_PORT ? Number(DATABASE_PORT) : 3306,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10, // máximo de conexiones simultáneas
    min: 0,
    acquire: 30000, // tiempo máximo para intentar conectar (ms)
    idle: 10000 // tiempo máximo que una conexión puede estar inactiva (ms)
  },
  dialectOptions: {
    connectTimeout: 20000 // 20 segundos
  }
}

if (DB_CA_CERT) {
  const certPath = path.join('/tmp', 'ca-cert.pem')
  try {
    fs.writeFileSync(certPath, DB_CA_CERT)
    const caContent = fs.readFileSync(certPath, 'utf8')
    sequelizeOptions.dialectOptions.ssl = {
      ca: caContent,
      rejectUnauthorized: false
    }
  } catch (err) {
    console.error('Error manejando el certificado SSL:', err)
  }
}

export const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  sequelizeOptions
)
