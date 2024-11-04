const conexion = require('../database/db');

exports.saveSale = (req, res) => {
  const producto = req.body.cut; // Asegúrate de que este valor se esté recibiendo
  const cantidad = parseFloat(req.body.quantity); // Convierte a número
  const precioPorLibra = parseFloat(req.body.price); // Asegúrate de que este valor se esté recibiendo
  const totalCalculado = precioPorLibra * cantidad; // Calcula el total
  const fecha = new Date().toISOString().slice(0, 10); // Fecha actual en formato 'YYYY-MM-DD'

  // Asegúrate de que 'precio' se obtenga correctamente
  if (!producto || isNaN(precioPorLibra) || isNaN(cantidad)) {
    return res.status(400).send('Datos no válidos');
  }

  conexion.query(
    'INSERT INTO compras_carnicos SET ?',
    { producto, precio: precioPorLibra, cantidad, fecha, total: totalCalculado },
    (error, results) => {
      if (error) {
        console.log('Error en la inserción de la venta', error);
        return res.send(`
          <script>
            alert('No se pudo registrar la venta. Intenta nuevamente.');
            window.location.href = '/create';
          </script>
        `);
      } else {
        res.send(`
          <script>
            alert('La venta ha sido registrada con éxito.');
            window.location.href = '/';
          </script>
        `);
      }
    }
  );
};
