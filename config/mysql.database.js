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

// Función para escribir el certificado en un archivo temporal
const writeCertToFile = async () => {
  if (DB_CA_CERT) {
    const certPath = path.join('/tmp', 'ca-cert.pem')
    try {
      await fs.promises.writeFile(certPath, DB_CA_CERT)
      return certPath
    } catch (error) {
      console.error('Error writing certificate file:', error)
      return null // Retorna nulo si hay un error
    }
  }
  return null
}

let sequelize = null

// Función asíncrona para inicializar y conectar Sequelize
const initializeSequelize = async () => {
  if (sequelize) {
    return sequelize
  }

  const certPath = await writeCertToFile()

  sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: certPath,
        rejectUnauthorized: false
      }
    },
    logging: false // Para no mostrar los logs SQL en la consola
  })

  try {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    throw error
  }

  return sequelize
}

export { initializeSequelize }
