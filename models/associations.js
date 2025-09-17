import { Client } from './client.model.js'
import { Invoices, InvoicesDetails } from './invoices.model.js'
import { Products } from './products.model.js'

Client.hasMany(Invoices, {
  foreignKey: 'clientId',
  onDelete: 'SET NULL',
  as: 'invoices'
})

Invoices.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
})

Invoices.hasMany(InvoicesDetails, {
  foreignKey: 'invoicesId',
  onDelete: 'CASCADE',
  as: 'invoicesDetails'
})

InvoicesDetails.belongsTo(Invoices, {
  foreignKey: 'invoicesId',
  as: 'invoices'
})

Products.hasMany(InvoicesDetails, {
  foreignKey: 'productsId',
  onDelete: 'SET NULL',
  as: 'invoicesDetails'
})

InvoicesDetails.belongsTo(Products, {
  foreignKey: 'productsId',
  as: 'product'
})

export { Client, Invoices, InvoicesDetails, Products }
