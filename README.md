# Proyecto Angular 18

¡Bienvenido(a) a este proyecto de Angular 18! A continuación, encontrarás las instrucciones necesarias para configurar, ejecutar y desplegar la aplicación, así como para estandarizar tu código y ejecutar pruebas unitarias.

## Requisitos previos

- **Angular 18** instalado de forma global.
- **Node.js 22.5.1** o superior.
- **NPM** (viene incluido con Node.js).

Asegúrate de verificar tu versión de Node.js con el siguiente comando:
```bash
node -v
```

Si no tienes la versión correcta, actualiza Node.js antes de continuar.

## Instalación

- Clona este repositorio o descarga los archivos en tu computadora.
- Desde la carpeta raíz del proyecto, ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias para ejecutar la aplicación.

## Ejecución en desarrollo

- Verifica que Angular CLI esté instalado de manera global con:
```bash
ng version
```
- Para levantar el servidor de desarrollo, utiliza el siguiente comando:
```bash
ng serve
```

Abre tu navegador y visita la dirección http://localhost:4200/ para ver la aplicación en ejecución.

## Estandarizar código y ejecutar pruebas

- Para verificar y estandarizar el código, ejecuta:
```bash
ng lint
```
- Para ejecutar las pruebas unitarias, utiliza:
```bash
ng test
```

## Despliegue en S3
La mejor forma de desplegar esta aplicación es a través de un Amazon S3 Bucket. A continuación, se describen los pasos generales:

- Compila la aplicación para producción:
```bash
ng build --prod
```
Esto generará una carpeta dist/ con los archivos listos para producción.

- Crea un Bucket en Amazon S3 y habilita la opción de hosting estático.

- Ingresa a tu consola de AWS, selecciona S3 y crea un nuevo Bucket.
- Configura los permisos y habilita la opción “Habilitar alojamiento de sitio web estático” (o Static Website Hosting).
- Sube la carpeta dist/ completa al Bucket que acabas de crear.

- Asegúrate de configurar los archivos de index y error (por ejemplo, index.html y error.html) en la sección de hosting estático.
- Habilita el acceso público a la aplicación (si corresponde) ajustando las políticas del Bucket.

Accede a la URL asignada por AWS S3 para verificar que tu aplicación Angular se está sirviendo correctamente.