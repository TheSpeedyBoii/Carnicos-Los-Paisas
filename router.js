const express = require('express'); 
const router = express.Router();  
const conexion = require('./database/db'); 
const crud = require('./controllers/crud'); 

// Ruta principal (GET)
router.get('/', (req, res) => {
  // Consulta para obtener las ventas
  const query = 'SELECT id, producto, precio, cantidad, DATE_FORMAT(fecha, "%d/%m/%Y") AS fecha, total FROM compras_carnicos';
  
  // Consulta para obtener la suma total de las ventas
  const totalQuery = 'SELECT SUM(total) AS total_ventas FROM compras_carnicos';

  conexion.query(query, (err, results) => {
    if (err) {
      console.log('Error en la consulta', err);
      return res.status(500).send('Error en la base de datos');
    }

    // Ejecutamos la consulta para obtener el total de ventas
    conexion.query(totalQuery, (err, totalResults) => {
      if (err) {
        console.log('Error en la consulta de total', err);
        return res.status(500).send('Error en la base de datos');
      }

      // Obtenemos el total de ventas
      const totalVentas = totalResults[0].total_ventas || 0; // Si no hay ventas, el total será 0

      // Renderizamos la vista y pasamos los resultados y el total
      res.render('index', { results: results, totalVentas: totalVentas });
    });
  });
});

// Ruta para crear registros (GET)
router.get('/create', (req, res) => {
  res.render('create');
});

// Ruta para guardar una nueva venta
router.post('/save', crud.saveSale); 

// Ruta para eliminar una venta
router.get('/delete/:id', (req, res) => {
  const saleId = req.params.id;

  conexion.query('DELETE FROM compras_carnicos WHERE id = ?', [saleId], (err, results) => {
    if (err) {
      console.log('Error en la eliminación', err);
      return res.status(500).send('Error en la base de datos');
    }

    // Redirigir a la vista principal después de eliminar
    res.redirect('/');  
  });
});

// Exportamos el router
module.exports = router; 
