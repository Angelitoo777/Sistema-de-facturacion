import { Invoices, InvoicesDetails, Products, Client } from '../models/associations.js'
import PDFDocument from 'pdfkit'

const generateTable = (doc, factura) => {
  const tableTop = 250
  const startY = tableTop + 20
  let position = startY

  // Encabezados de la tabla con fondo
  doc.save()
  doc.rect(45, tableTop, 520, 20).fill('#f0f0f0')
  doc.restore()
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#333')
  doc.text('Producto', 50, tableTop + 5, { width: 250 })
  doc.text('Cantidad', 320, tableTop + 5, { width: 80, align: 'right' })
  doc.text('Precio Unitario', 400, tableTop + 5, { width: 80, align: 'right' })
  doc.text('Subtotal', 490, tableTop + 5, { width: 80, align: 'right' })
  doc.moveTo(45, tableTop + 20).lineTo(565, tableTop + 20).stroke('#cccccc')

  doc.font('Helvetica').fontSize(10).fillColor('#222')

  const rowHeight = 18

  if (Array.isArray(factura.invoicesDetails) && factura.invoicesDetails.length > 0) {
    for (const item of factura.invoicesDetails) {
      const quantity = Number(item.quantity) || 0
      const priceUnitary = Number(item.price_unitary) || 0
      const subtotalItem = quantity * priceUnitary
      const productName = item.product && item.product.name ? item.product.name : 'Producto eliminado'

      doc.text(productName, 50, position, { width: 250 })
      doc.text(quantity.toLocaleString(), 320, position, { width: 80, align: 'right' })
      doc.text(`$${priceUnitary.toFixed(2).toLocaleString()}`, 400, position, { width: 80, align: 'right' })
      doc.text(`$${subtotalItem.toFixed(2).toLocaleString()}`, 490, position, { width: 80, align: 'right' })

      doc.moveTo(45, position + rowHeight - 2).lineTo(565, position + rowHeight - 2).stroke('#ededed')
      position += rowHeight
    }
  } else {
    doc.font('Helvetica-Oblique').fillColor('#888').text('Sin productos en esta factura', 50, position)
    position += rowHeight
  }

  // Línea del total destacado
  const finalTotalY = position + 10
  const total = Number(factura.total) || 0
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#0057b7')
  doc.text('Total:', 400, finalTotalY, { width: 80, align: 'right' })
  doc.text(`$${total.toFixed(2).toLocaleString()}`, 490, finalTotalY, { width: 80, align: 'right' })
  doc.fillColor('#000')
}

export const createPDF = async (req, res) => {
  try {
    const { id } = req.params
    // Obtener todos los datos de la factura
    const factura = await Invoices.findByPk(id, {
      include: [
        { model: Client, as: 'client' },
        {
          model: InvoicesDetails,
          as: 'invoicesDetails',
          include: [{ model: Products, as: 'product' }]
        }
      ]
    })
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' })
    }
    // Configurar los encabezados de la respuesta para el PDF
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=factura_${id}.pdf`)

    // Crear el documento PDF y enviarlo
    const doc = new PDFDocument({ margin: 40 })
    doc.pipe(res)

    // Encabezado con logo y empresa
    // doc.image('ruta/a/logo.png', 45, 40, { width: 60 })
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#0057b7').text('Mi Empresa S.A. de C.V.', 120, 45, { align: 'left' })
    doc.font('Helvetica').fontSize(10).fillColor('#333')
    doc.text('RFC: XAXX010101000', 120, 75)
    doc.text('Dirección: Calle Ficticia 123, Ciudad, País', 120, 90)
    doc.text('Tel: (555) 123-4567 | Email: contacto@miempresa.com', 120, 105)
    doc.moveTo(40, 130).lineTo(565, 130).stroke('#0057b7')

    // Título de la factura
    doc.font('Helvetica-Bold').fontSize(26).fillColor('#222').text('FACTURA', 0, 145, { align: 'center' })

    // Información de la factura
    doc.font('Helvetica').fontSize(11).fillColor('#333')
    doc.text(`Número: ${factura.id}`, 50, 190)
    doc.text(`Fecha: ${new Date(factura.createdAt).toLocaleDateString()}`, 50, 210)

    // Información del cliente
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#0057b7').text('Datos del Cliente', 350, 190)
    doc.font('Helvetica').fontSize(10).fillColor('#222')
    doc.text(`Nombre: ${factura.client.name}`, 350, 210)
    doc.text(`Email: ${factura.client.email}`, 350, 225)
    doc.text(`Dirección: ${factura.client.address}`, 350, 240, { width: 200 })

    // Tabla de productos y detalles
    generateTable(doc, factura)

    // Pie de página elegante - Ajustado para que no se vaya a la siguiente página
    const footerY = 730
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#888')
    doc.text('Gracias por su compra. Para dudas o aclaraciones comuníquese a nuestro contacto.', 40, footerY, { align: 'center', width: 500 })
    doc.font('Helvetica').fontSize(8).fillColor('#bbb')
    doc.text('Factura generada por Mi Empresa S.A. de C.V. | www.miempresa.com', 40, footerY + 15, { align: 'center', width: 500 })

    doc.end()
  } catch (error) {
    console.error('Error al generar el PDF:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
