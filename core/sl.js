const mysql = require('mysql2/promise');

// Fonction pour créer une connexion à la base MySQL
function getConnection() {
  const connection =  mysql.createConnection({
    host: '127.0.0.1',
    user: 'symfony',
    password: 'Este2003.',
    database: 'taches'
  });
  return connection;
}

// Export de la fonction
module.exports = { getConnection };