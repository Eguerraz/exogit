const mysql = require('mysql2/promise');

// Fonction pour créer une connexion à la base MySQL
async function getConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'symfony',
      password: 'Este2003.',
      database: 'taches'
    });
    console.log('✅ Connecté à la base de données MySQL !');
    return connection;
  } catch (err) {
    console.error('❌ Erreur de connexion :', err.message);
    throw err;
  }
}

// Export de la fonction
module.exports = { getConnection };
