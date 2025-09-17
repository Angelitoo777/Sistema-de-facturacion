import { Client } from '../models/client.model.js'
import { validationClient } from '../validations/client.validation.js'

export class ClientController {
  static async getAll (req, res) {
    try {
      const getClients = await Client.findAll()

      return res.status(200).json(getClients)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createClient (req, res) {
    const validation = validationClient(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }
    const { name, email, phone, address } = validation.data

    try {
      const newClient = await Client.create({ name, email, phone, address })
      return res.status(201).json(newClient)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
