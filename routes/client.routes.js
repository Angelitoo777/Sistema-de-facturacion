import { Router } from 'express'
import { ClientController } from '../controllers/client.controller.js'

export const routesOfClients = Router()

routesOfClients.get('/clients', ClientController.getAll)
routesOfClients.get('/clients/:id', ClientController.getById)

routesOfClients.post('/clients', ClientController.createClient)
routesOfClients.patch('/clients/:id', ClientController.updateClient)
routesOfClients.delete('/clients/:id', ClientController.deleteClient)
