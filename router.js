const express = require('express'); // Invocamos a Express
const router = express.Router();  // Invocamos el router de Express
const conexion = require('./database/db'); // Ruta para la base de datos
const path = require('path');

// Ruta principal (GET) para renderizar la página 'index'
router.get('/', (req, res) => {
  // Realizamos la consulta a la base de datos
  conexion.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.log('Error en la consulta', err);
      return res.status(500).send('Error en la base de datos');
    }
    // Si no hay error, renderizamos la vista y pasamos los resultados
    res.render('index', { results: results });  // Pasamos los datos obtenidos como 'results'
  });
});

// Ruta para obtener el formulario de edición
router.get('/edit/:id', (req, res) => {
  const userId = req.params.id;

  // Consultar el usuario específico
  conexion.query('SELECT * FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.log('Error en la consulta', err);
      return res.status(500).send('Error en la base de datos');
    }
    // Verificar si se encontró el usuario
    if (results.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.render('edit', { user: results[0] });  // Pasamos los datos del usuario a la vista
  });
});

// Ruta para guardar los cambios
router.post('/update/:id', (req, res) => {
  const userId = req.params.id;
  const { user, last_name, rol } = req.body;

  conexion.query('UPDATE usuarios SET user = ?, last_name = ?, rol = ? WHERE id = ?', [user, last_name, rol, userId], (err, results) => {
    if (err) {
      console.log('Error en la actualización', err);
      return res.status(500).send('Error en la base de datos');
    }
    res.redirect('/');  // Redirigir a la vista principal después de actualizar
  });
});

// Ruta para eliminar un usuario
router.get('/delete/:id', (req, res) => {
  const userId = req.params.id;

  conexion.query('DELETE FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.log('Error en la eliminación', err);
      return res.status(500).send('Error en la base de datos');
    }

    // Consulta para restablecer el valor de autoincremento
    conexion.query('ALTER TABLE usuarios AUTO_INCREMENT = 1', (err, results) => {
      if (err) {
        console.log('Error al restablecer AUTO_INCREMENT', err);
        return res.status(500).send('Error en la base de datos');
      }
      res.redirect('/');  // Redirigir a la vista principal después de eliminar
    });
  });
});


// Ruta para crear registros
router.get('/create', (req, res) => {
  res.render('create');
});

// Ruta para guardar nuevos registros

const crud = require('./controllers/crud');
router.post('/save', crud.save);




// Exportamos el router para usarlo en otros archivos
module.exports = router;
