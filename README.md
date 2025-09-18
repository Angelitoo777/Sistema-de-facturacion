
# 💼 Sistema de Facturación

> **Una solución moderna, profesional e intuitiva para la gestión de clientes, productos y facturas.**

---

## 🚀 Descripción
Sistema de facturación RESTful desarrollado con **Node.js**, **Express.js** y **MySQL** (usando Sequelize como ORM). Permite gestionar clientes, productos y facturas, generando reportes en PDF y facilitando el control financiero de tu negocio.

---

## 🏗️ Estructura del Proyecto

```
├── app.js
├── api/
│   └── index.js
├── config/
│   └── mysql.database.js
├── controllers/
│   ├── client.controller.js
│   ├── invoice.controller.js
│   └── products.controller.js
├── middlewares/
│   └── cors.middleware.js
├── models/
│   ├── associations.js
│   ├── client.model.js
│   ├── invoices.model.js
│   └── products.model.js
├── routes/
│   ├── client.routes.js
│   ├── invoice.routes.js
│   └── product.routes.js
├── services/
│   └── pdfInvoice.services.js
├── validations/
│   ├── client.validation.js
│   ├── invoice.validation.js
│   └── product.validation.js
├── package.json
└── README.md
```

---

## ⚙️ Instalación

1. Clona el repositorio:
	```bash
	git clone https://github.com/Angelitoo777/Sistema-de-facturacion.git
	cd Sistema-de-facturacion
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Configura las variables de entorno en un archivo `.env`:
	```env
	DATABASE_NAME=nombre_db
	DATABASE_USERNAME=usuario
	DATABASE_PASSWORD=contraseña
	DATABASE_HOST=localhost
	DATABASE_PORT=3306
	# Opcional para despliegue seguro
	DB_CA_CERT=contenido_certificado
	```
4. Inicia el servidor:
	```bash
	npm run dev
	```

---

## 📦 Endpoints Principales

### Clientes
| Método | Endpoint           | Descripción                |
|--------|--------------------|----------------------------|
| GET    | /api/clients       | Listar todos los clientes  |
| GET    | /api/clients/:id   | Obtener cliente por ID     |
| POST   | /api/clients       | Crear nuevo cliente        |
| PATCH  | /api/clients/:id   | Actualizar cliente         |
| DELETE | /api/clients/:id   | Eliminar cliente           |

### Productos
| Método | Endpoint             | Descripción                  |
|--------|----------------------|------------------------------|
| GET    | /api/products        | Listar todos los productos   |
| GET    | /api/products/:id    | Obtener producto por ID      |
| POST   | /api/products        | Crear nuevo producto         |
| PATCH  | /api/products/:id    | Actualizar producto          |
| DELETE | /api/products/:id    | Eliminar producto            |

### Facturas
| Método | Endpoint                | Descripción                        |
|--------|-------------------------|------------------------------------|
| GET    | /api/invoices           | Listar todas las facturas          |
| GET    | /api/invoices/:id       | Obtener factura por ID             |
| POST   | /api/invoices           | Crear nueva factura                |
| GET    | /api/invoices/pdf/:id   | Descargar factura en PDF           |

---

## 🧩 Tecnologías y Librerías

- Node.js & Express.js
- MySQL & Sequelize
- PDFKit (generación de PDF)
- Zod (validaciones)
- CORS, dotenv, bcrypt

---

## 📝 Notas

- El sistema está preparado para despliegue en Vercel y entornos cloud.
- Incluye validaciones robustas y manejo de errores.
- La generación de PDF es personalizable en `services/pdfInvoice.services.js`.

---

## 👨‍💻 Autor

Desarrollado por [Angelitoo777](https://github.com/Angelitoo777)

---

¡Contribuciones y sugerencias son bienvenidas!
