import { Router } from 'express'
import { ProductController } from '../controllers/products.controller.js'

export const routesOfProducts = Router()

routesOfProducts.get('/products', ProductController.getAll)
routesOfProducts.get('/products/:id', ProductController.getById)

routesOfProducts.post('/products', ProductController.createProduct)
routesOfProducts.patch('/products/:id', ProductController.updateProduct)
routesOfProducts.delete('/products/:id', ProductController.deleteProduct)
