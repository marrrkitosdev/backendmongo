Productos de computación. Trabajo realizado por Marcos Teves y Martin Teves.

# Manual de Uso - Aplicación de Gestión de Productos

## Descripción
Esta aplicación utiliza Express.js como servidor y MongoDB como base de datos para gestionar productos de computación.

## Endpoints Disponibles

1. **Obtener todos los productos**
   - Método: GET
   - URL: `/`
   - Descripción: Devuelve todos los productos almacenados en la base de datos.

2. **Obtener producto por ID**
   - Método: GET
   - URL: `/id/:id`
   - Descripción: Busca y devuelve un producto específico por su ID.

3. **Buscar producto por nombre**
   - Método: GET
   - URL: `/nombre/:nombre`
   - Descripción: Busca y devuelve un producto que coincida con el nombre proporcionado (no distingue entre mayúsculas y minúsculas).

4. **Crear un nuevo producto**
   - Método: POST
   - URL: `/computacion/create`
   - Descripción: Crea un nuevo producto en la base de datos.
   - Cuerpo de la solicitud (JSON): `{ "nombre": "Nombre del Producto", "precio": 100.00, "descripcion": "Descripción del producto" }`

5. **Actualizar un producto existente**
   - Método: PUT
   - URL: `/computacion/update/:id`
   - Descripción: Actualiza un producto existente según su ID.
   - Cuerpo de la solicitud (JSON): `{ "nombre": "Nuevo Nombre", "precio": 120.00, "descripcion": "Nueva descripción" }`

6. **Eliminar un producto**
   - Método: DELETE
   - URL: `/computacion/delete/:id`
   - Descripción: Elimina un producto de la base de datos según su ID.

## Uso Recomendado

- **Crear un producto:** Utiliza el endpoint `POST /computacion/create` para agregar nuevos productos.
- **Actualizar un producto:** Usa el endpoint `PUT /computacion/update/:id` para modificar la información de un producto existente.
- **Eliminar un producto:** Utiliza `DELETE /computacion/delete/:id` para eliminar productos que ya no necesites.
- **Consultar productos:** Puedes buscar productos por ID con `GET /id/:id` o por nombre con `GET /nombre/:nombre`.
- **Manejo de errores:** La aplicación maneja errores internos y notifica errores de solicitud adecuadamente.

## Ejemplos de Uso

- **Obtener todos los productos:**
GET http://localhost:3000/

- **Crear un nuevo producto:**
POST http://localhost:3000/computacion/create
Body: { "nombre": "Teclado mecánico", "precio": 80.00, "descripcion": "Teclado para juegos retroiluminado" }

- **Actualizar un producto existente:**
PUT http://localhost:3000/computacion/update/1
Body: { "nombre": "Nuevo nombre", "precio": 90.00, "descripcion": "Descripción actualizada" }

- **Eliminar un producto:**
DELETE http://localhost:3000/computacion/delete/1

## Notas adicionales

- Asegurate de tener MongoDB en ejecución y configurado correctamente para que la aplicación pueda conectarse y manipular la base de datos.
- Todos los endpoints que no coincidan con los mencionados devolverán un mensaje de error "Endpoint no encontrado".
