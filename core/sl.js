const mysql = require('mysql2/promise');

console.log("Pas mal la faut de frappe dans le nom du fichier");
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