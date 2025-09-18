import { Router } from 'express'
import { InvoiceController } from '../controllers/invoice.controller.js'

export const routesOfInvoices = Router()

routesOfInvoices.get('/invoices', InvoiceController.getAll)
routesOfInvoices.get('/invoices/:id', InvoiceController.getById)

routesOfInvoices.post('/invoices', InvoiceController.createInvoice)
routesOfInvoices.get('/invoices/pdf/:id', InvoiceController.createPDF)
