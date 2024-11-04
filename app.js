const express = require('express');            // Requerimos el módulo de Express para crear la aplicación
const app = express();                       // con esta configuración invocamos a express 

app.set('view engine', 'ejs');      // Configuramos EJS como el motor de plantillas, que genera vistas HTML dinámicas
app.use(express.urlencoded({extended:false}));  // Middleware para parsear datos de formularios (formulario URL-encoded)
app.use(express.json());                       // Middleware para parsear datos en formato JSON

app.use('/', require('./router'));   // Definimos el enrutador principal para manejar todas las rutas que comienzan con '/'

const port = 5000;
 
app.listen(port, '0.0.0.0', () => {     // Configuramos el servidor para escuchar en el puerto 5000 y aceptar conexiones desde cualquier IP (0.0.0.0)
     console.log('SERVER CORRIENDO EN http://localhost:5000');    // Asi con  esta configuración el puerto corre                                                                  // en cualquier navegador
});
