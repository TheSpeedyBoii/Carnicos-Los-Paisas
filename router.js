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

// Ruta para mostrar el formulario de edición
router.get('/edit/:id', (req, res) => {
  const productId = req.params.id;

  conexion.query('SELECT * FROM compras_carnicos WHERE id = ?', [productId], (err, results) => {
    if (err) {
      console.log('Error en la consulta de edición', err);
      return res.status(500).send('Error en la base de datos');
    }

    if (results.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    const product = results[0];
    res.render('edit', { product }); // Asegúrate de que el nombre de la vista es correcto
  });
});

router.post('/update/:id', (req, res) => {
  const productId = req.params.id;
  const { cut, quantity } = req.body;
  const price = parseFloat(req.body.price); // Convertir a número

  conexion.query('UPDATE compras_carnicos SET producto = ?, precio = ?, cantidad = ? WHERE id = ?', [cut, price, quantity, productId], (err, results) => {
    if (err) {
      console.log('Error en la actualización:', err);
      return res.status(500).send('Error en la base de datos');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Registro no encontrado');
    }

    res.redirect('/');  // Redirigir a la vista principal después de actualizar
  });
});



router.post('/filter', (req, res) => {
  const { month } = req.body;

  const query = `
    SELECT id, producto, precio, cantidad, DATE_FORMAT(fecha, "%d/%m/%Y") AS fecha, total 
    FROM compras_carnicos 
    WHERE MONTH(fecha) = ?
  `;

  conexion.query(query, [month], (err, results) => {
    if (err) {
      console.log('Error en la consulta de filtro', err);
      return res.status(500).send('Error en la base de datos');
    }

    const totalQuery = 'SELECT SUM(total) AS total_ventas FROM compras_carnicos WHERE MONTH(fecha) = ?';
    
    conexion.query(totalQuery, [month], (err, totalResults) => {
      if (err) {
        console.log('Error en la consulta de total', err);
        return res.status(500).send('Error en la base de datos');
      }

      const totalVentas = totalResults[0].total_ventas || 0;

      res.render('index', { results: results, totalVentas: totalVentas });
    });
  });
});

// Exportamos el router
module.exports = router;
