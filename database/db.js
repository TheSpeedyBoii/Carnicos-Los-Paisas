const mysql = require('mysql');  //  Uso de mysql como una constante

const conexion =  mysql.createConnection({  //Parametros para la conexión a la base de datos
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_nodejs_db'
});

conexion.connect((error)=> {   // Manejo de errores
    if (error) {
        console.error('El error de conexión es: ' + error);
        return;
    }
    console.log('Conectado a la Bd Mysql');
})

module.exports = conexion;  // EXPORTAMOS
