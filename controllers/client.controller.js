import { Client } from '../models/client.model.js'

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
}
