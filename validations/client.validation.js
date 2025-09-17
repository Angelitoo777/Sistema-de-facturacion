import { z } from 'zod'

const validateClient = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().trim(),
  address: z.string()
})

export const validationClient = (data) => {
  return validateClient.safeParse(data)
}

export const validationPartialClient = (data) => {
  return validateClient.partial().safeParse(data)
}
