import { validationProduct, validationPartialProduct } from '../validations/product.validation.js'
import { Products } from '../models/associations.js'
import { redisDB } from '../config/redis.database.js'

const redisClient = await redisDB()

export class ProductController {
  static async getAll (req, res) {
    try {
      const cacheProducts = await redisClient.get('products')

      if (cacheProducts) {
        return res.status(200).json(JSON.parse(cacheProducts))
      }

      const findProducts = await Products.findAll()

      await redisClient.setex('products', 3600, JSON.stringify(findProducts))

      return res.status(200).json(findProducts)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async getById (req, res) {
    const { id } = req.params
    try {
      const cacheId = await redisClient.get(`products:${id}`)

      if (cacheId) {
        return res.status(200).json(JSON.parse(cacheId))
      }

      const findProductById = await Products.findByPk(id)

      if (!findProductById) {
        return res.status(404).json({ message: 'Producto no encontrado' })
      }

      await redisClient.setex(`products:${id}`, 3600, JSON.stringify(findProductById))

      return res.status(200).json(findProductById)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createProduct (req, res) {
    const validation = validationProduct(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }
    const { name, description, price, stock } = validation.data

    try {
      const newProduct = await Products.create({ name, description, price, stock })

      await redisClient.del('products')

      return res.status(201).json(newProduct)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async updateProduct (req, res) {
    const { id } = req.params
    const validation = validationPartialProduct(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }
    const { name, description, price, stock } = validation.data

    try {
      const [updateProductById] = await Products.update({ name, description, price, stock }, { where: { id } })

      if (updateProductById === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' })
      }

      const productUpdated = await Products.findByPk(id)

      await redisClient.del('products')

      return res.status(200).json({ message: 'Producto actualizado correctamente', productUpdated })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async deleteProduct (req, res) {
    const { id } = req.params

    try {
      const findProduct = await Products.findByPk(id)

      if (!findProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' })
      }

      await Products.destroy({ where: { id } })

      await redisClient.del('products')

      return res.status(200).json({ message: 'Producto eliminado exitosamente' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
