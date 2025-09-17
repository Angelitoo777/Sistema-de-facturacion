import { DataTypes } from 'sequelize'
import { sequelize } from '../config/mysql.database.js'

export const Invoices = sequelize.define('invoices', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.STRING
  }
})

export const InvoicesDetails = sequelize.define('invoicesDetails', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price_unitary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
})
