import { z } from 'zod'

const validateProduct = z.object({
  name: z.string().min(3).max(155),
  description: z.string(),
  price: z.number().multipleOf(0.01),
  stock: z.int()
})

export const validationProduct = (data) => {
  return validateProduct.safeParse(data)
}

export const validationPartialProduct = (data) => {
  return validateProduct.partial().safeParse(data)
}
