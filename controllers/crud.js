const conexion = require('../database/db');

exports.save = (req, res) => {
  const user = req.body.user;
  const last_name = req.body.last_name;
  const rol = req.body.rol;

  // Primero verifica si el usuario ya existe
  conexion.query('SELECT * FROM usuarios WHERE user = ?', [user], (error, results) => {
    if (error) {
      console.log('Error en la consulta', error);
      return res.send(`
        <script>
          alert('Hubo un problema al consultar la base de datos. Intenta nuevamente.');
          window.location.href = '/create';
        </script>
      `);
    }

    if (results.length > 0) {
      // Si el usuario ya existe, muestra un mensaje de error
      res.send(`
        <script>
          alert('El usuario ya existe. Por favor, elige otro nombre.');
          window.location.href = '/create';
        </script>
      `);
    } else {
      // Si el usuario no existe, procede a insertarlo
      conexion.query(
        'INSERT INTO usuarios SET ?',
        { user: user, last_name: last_name, rol: rol },
        (error, results) => {
          if (error) {
            console.log('Error en la inserción', error);
            return res.send(`
              <script>
                alert('No se pudo registrar el usuario. Intenta nuevamente.');
                window.location.href = '/create';
              </script>
            `);
          } else {
            res.send(`
              <script>
                alert('El usuario ha sido registrado con éxito.');
                window.location.href = '/';
              </script>
            `);
          }
        }
      );
    }
  });
};
