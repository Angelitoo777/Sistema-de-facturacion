import { Router } from 'express'
import { ClientController } from '../controllers/client.controller.js'

export const routesOfClients = Router()

routesOfClients.get('/clients', ClientController.getAll)
