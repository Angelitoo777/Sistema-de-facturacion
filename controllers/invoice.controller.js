import { Transaction } from 'sequelize'
import { sequelize } from '../config/mysql.database.js'
import { Invoices, InvoicesDetails, Products, Client } from '../models/associations.js'
import { validationInvoice } from '../validations/invoice.validation.js'
import { createPDF } from '../services/pdfInvoice.services.js'
import { redisDB } from '../config/redis.database.js'

const redisClient = await redisDB()

export class InvoiceController {
  static async getAll (req, res) {
    try {
      const cacheInvoice = await redisClient.get('invoices')

      if (cacheInvoice) {
        return res.status(200).json(JSON.parse(cacheInvoice))
      }

      const findAll = await Invoices.findAll({
        include: [
          { model: Client, as: 'client' },
          {
            model: InvoicesDetails,
            as: 'invoicesDetails',
            include: [{ model: Products, as: 'product' }]
          }
        ]
      })

      await redisClient.setex('invoice', 3600, JSON.stringify(findAll))

      return res.status(200).json(findAll)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async getById (req, res) {
    const { id } = req.params

    try {
      const cacheId = await redisClient.get(`invoice:${id}`)

      if (cacheId) {
        return res.status(200).json(JSON.parse(cacheId))
      }

      const findById = await Invoices.findByPk(id, {
        include: [
          { model: Client, as: 'client' },
          {
            model: InvoicesDetails,
            as: 'invoicesDetails',
            include: [{ model: Products, as: 'product' }]
          }
        ]
      })

      if (!findById) {
        return res.status(404).json({ message: 'Factura no encontrada' })
      }

      await redisClient.setex(`invoice:${id}`, 3600, JSON.stringify(findById))

      return res.status(200).json(findById)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createInvoice (req, res) {
    const validation = validationInvoice(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }
    const { clientId, total, details } = validation.data

    try {
      const transactionInvoice = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE }, async (transaction) => {
        const newInvoice = await Invoices.create({ clientId, total }, { transaction })

        const invoiceDetailId = details.map((detail) => {
          const subTotalCalculado = detail.quantity * detail.price_unitary
          return {
            quantity: detail.quantity,
            price_unitary: detail.price_unitary,
            subtotal: subTotalCalculado,
            invoicesId: newInvoice.id,
            productsId: detail.productId
          }
        })

        await InvoicesDetails.bulkCreate(invoiceDetailId, { transaction })

        return newInvoice
      })

      await redisClient.del('invoices')

      return res.status(201).json({ message: 'Factura creada exitosamente' }, transactionInvoice.newInvoice)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createPDF (req, res) {
    try {
      const newPDF = await createPDF(req, res)

      return newPDF
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
