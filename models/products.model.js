import { DataTypes } from 'sequelize'
import { sequelize } from '../config/mysql.database.js'

export const Products = sequelize.define('products', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.NUMBER,
    allowNull: false
  }
})
