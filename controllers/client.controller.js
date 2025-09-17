import { Client } from '../models/associations.js'
import { validationClient, validationPartialClient } from '../validations/client.validation.js'

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

  static async getById (req, res) {
    const { id } = req.params

    try {
      const findById = await Client.findByPk(id)

      if (!findById) {
        return res.status(404).json({ message: 'Cliente no encontrado' })
      }

      return res.status(200).json(findById)
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

  static async updateClient (req, res) {
    const { id } = req.params
    const validation = validationPartialClient(req.body)
    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }
    const { name, phone, address } = validation.data

    try {
      const [updateClientById] = await Client.update({ name, phone, address }, { where: { id } }) // Desestructuramos en un array para ver las filas afectadas

      if (updateClientById === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' })
      }

      const updatedClient = await Client.findByPk(id)

      return res.status(200).json({ message: 'Cliente actualizado correctamente', updatedClient })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async deleteClient (req, res) {
    const { id } = req.params

    try {
      const findUser = await Client.findByPk(id)

      if (!findUser) {
        return res.status(404).json({ message: 'Cliente no encontrado' })
      }

      await Client.destroy({ where: { id } })

      return res.status(200).json({ message: 'Cliente eliminado exitosamente' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
