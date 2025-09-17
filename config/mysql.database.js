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
      console.log('Intentando escribir el certificado en:', certPath)
      await fs.promises.writeFile(certPath, DB_CA_CERT)
      console.log('Certificado escrito correctamente.')
      return certPath
    } catch (error) {
      console.error('Error writing certificate file:', error)
      return null // Retorna nulo si hay un error
    }
  }
  console.log('No se encontró DB_CA_CERT en variables de entorno.')
  return null
}

let sequelize = null

// Función asíncrona para inicializar y conectar Sequelize
const initializeSequelize = async () => {
  if (sequelize) {
    return sequelize
  }

  const certPath = await writeCertToFile()

  const sequelizeOptions = {
    host: DATABASE_HOST,
    port: DATABASE_PORT ? Number(DATABASE_PORT) : 3306,
    dialect: 'mysql',
    logging: false // Para no mostrar los logs SQL en la consola
  }

  if (certPath) {
    try {
      const caContent = fs.readFileSync(certPath, 'utf8')
      console.log('Contenido del certificado CA (primeros 100 chars):', caContent.substring(0, 100))
      sequelizeOptions.dialectOptions = {
        ssl: {
          ca: caContent,
          rejectUnauthorized: false // Cambia a false si tu proveedor lo requiere
        }
      }
    } catch (err) {
      console.error('Error leyendo el archivo de certificado:', err)
    }
  } else {
    console.log('No se usará SSL para la conexión MySQL.')
  }

  sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, sequelizeOptions)

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
