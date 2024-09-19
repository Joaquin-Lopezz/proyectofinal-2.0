# proyecto final beta 

# Proyecto de Ecomerce con Node.js

Este proyecto de E-commerce desarrollado en Node.js incluye un sistema de autenticación que permite a los usuarios iniciar sesión utilizando credenciales locales o mediante GitHub, recuperacion de contraseña mediante del gmil . Los usuarios registrados pueden agregar productos a un carrito de compras y proceder con la compra, generando automáticamente un ticket que se envía por correo electrónico a través de Gmail. Además,los usuarios premium podran agregar productos y eliminar los que les pertenescan. Y para la gestión de productos, se requiere acceso de administrador para editar, eliminar y añadir nuevos productos.

## Dependencias

- **bcrypt** (v5.1.1): Librería para el hash de contraseñas.
- **connect-mongo** (v5.1.0): Middleware para conectar Express.js a MongoDB para almacenar sesiones.
- **express** (v4.18.2): Framework web para Node.js.
- **express-handlebars** (v7.1.2): Motor de plantillas para Express.js.
- **mongoose** (v8.0.3): ODM (Object-Document Mapper) para MongoDB.
- **passport** (v0.7.0): Middleware de autenticación para Node.js.
- **passport-github2** (v0.1.12): Estrategia Passport para autenticación OAuth con GitHub.
- **passport-local** (v1.0.0): Estrategia Passport para autenticación local basada en usuario y contraseña.
- **session** (v0.1.0): Middleware de sesión para Express.js.
- **socket-io** (v4.7.5): chat online con los usuarios
- **nodemailer** (v6.9.14): para manejar el envio de ticket mediante Gmail
- **supertest**: Utilizado para testear los campos de sesiones, productos y carritos.

## Documentación

La documentación del proyecto está disponible a través de Swagger.




## Ejecución

1. Clona este repositorio en tu máquina local.
2. Abre la terminal y navega hasta la carpeta `src`.
3. Ejecuta el siguiente comando para instalar las dependencias:  `npm run dev`
4. inicia la aplicaion con: `npm run dev`
5. Accede a la aplicación web en http://localhost:8080.


## USUARIOS

## login ![image](https://github.com/user-attachments/assets/bbac4caf-25e1-4a96-8d11-c822fc77bf6f)

## perfil ![image](https://github.com/user-attachments/assets/90528ad1-44f1-4773-89fb-e9a1f30e6553)

## info Perfil ![image](https://github.com/user-attachments/assets/833db8b9-ad19-42a3-ba26-08bcde39aebe)
  
## nuevo producto ![image](https://github.com/user-attachments/assets/f4efd994-28fc-4280-be77-ed3ee0ab95eb)

## compra ![image](https://github.com/user-attachments/assets/5a4f1a83-d1f2-44fa-a986-271150c9a4ef)



## ADMIN

## vista de admin ![image](https://github.com/user-attachments/assets/a7fcc645-2bed-4086-b422-4bad6a25732e)

![image](https://github.com/user-attachments/assets/9dc57258-5220-427a-befa-d688f5de0038)
