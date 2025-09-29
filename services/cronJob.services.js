import axios from 'axios'

export class CronJob {
  static async calentar (req, res) {
    const urls = [
      'https://my-billing-app-tan.vercel.app/clients',
      'https://my-billing-app-tan.vercel.app/invoices',
      'https://my-billing-app-tan.vercel.app/products',
      'https://sistema-de-facturacion-eight.vercel.app/api/clients',
      'https://sistema-de-facturacion-eight.vercel.app/api/invoices',
      'https://sistema-de-facturacion-eight.vercel.app/api/products'
    ]

    try {
      Promise.all(urls.map(url => axios.get(url)))

      console.log('Todos los endpoints críticos han sido "calentados".')
      return res.status(200).send('OK')
    } catch (error) {
      console.error('Error al calentar los endpoints:', error.message)
      return res.status(500).send('Error')
    }
  }
}
