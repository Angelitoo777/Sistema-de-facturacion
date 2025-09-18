import { z } from 'zod'

// Esquema para cada item de la factura (detalle)
const validateInvoiceDetails = z.object({
  productId: z.string().uuid(), // Asegura que es un string y un UUID
  quantity: z.number().int().positive(), // Un número entero positivo
  price_unitary: z.number().positive() // Un número positivo
})

// Esquema principal para la creación de una factura
const validateInvoice = z.object({
  clientId: z.string().uuid(),
  total: z.number().positive(),
  details: z.array(validateInvoiceDetails).min(1) // Un array con al menos un detalle
})

export const validationInvoice = (data) => {
  return validateInvoice.safeParse(data)
}
