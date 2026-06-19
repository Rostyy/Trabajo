const mysql = require('mysql2');

// mysql2 crea la conexion con los datos del archivo .env.
// Esta conexion se importa en los controladores para ejecutar consultas SQL.
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// connectDb separa "crear la conexion" de "abrirla".
// Esto permite importar la app en tests sin conectarse automaticamente a MySQL.
const connectDb = (onConnected) => {
  connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
    if (onConnected) onConnected();
  });
};

module.exports = connection;
module.exports.connectDb = connectDb;
