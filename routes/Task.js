const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const sql = require('../core/sql');


//récupérer toutes les tâches
router.get('/', async function(req, res, name) {
    
    //connexion à la base de données
    const connection = await sql.getConnection();
    //exécution de la requête
    const [result] = await connection.query('SELECT * FROM task');
        //gestion des filtres
        
      if (req.query.done) {
        const doneQuery = req.query.done.toLowerCase(); // transformer en minuscules pour éviter les erreurs

        // Vérification de la validité du paramètre 'done'
        if (doneQuery !== 'true' && doneQuery !== 'false') {
          return res.status(400).json({ erreur: "Le paramètre 'done' doit être 'true' ou 'false'" });
        }

        // Conversion de la chaîne en entier (1 pour true, 0 pour false)
        const done = req.query.done === 'true' ? 1 : 0;

        // Requête SQL avec le filtre 'done'
        const [filteredResult] = await connection.query('SELECT * FROM task WHERE done = ?', [done]);
        return res.json(filteredResult);
      }

      // Filtre par titre (recherche partielle)
      if (req.query.titre) {
        const titre = `%${req.query.titre}%`;
        const [filteredResult] = await connection.query('SELECT * FROM task WHERE titre LIKE ?', [titre]);
        return res.json(filteredResult);
      }

      //filtre pour les retards
      if (req.query.retard) {
        const date = new Date().toISOString().slice(0, 19).replace('T', ' '); 
        const retard = req.query.retard;

        //si il y a un retard
        if (retard === "true"){
            const [filteredResult] = await connection.query('SELECT * FROM task WHERE done = 0 AND datetime < ?',[date]);
            return res.json(filteredResult);
        }
        else if (retard === "false"){
            const [filteredResult] = await connection.query('SELECT * FROM task WHERE done = 0 AND datetime > ?',[date]);
            return res.json(filteredResult);
        }
        else{
          return res.status(400).json({ erreur: "Le paramètre 'retard' doit être 'true' ou 'false'" });
        }
        
        
      }
      //selectionner des pages
      if (req.query.page){
        const number = 10 * (req.query.page - 1);
        const [filteredResult] = await connection.query('SELECT * FROM task ORDER BY id ASC LIMIT 10 OFFSET ?', [number]);
        return res.json(filteredResult);
      }
 
    res.json(result);
});
router.get('/view', (req, res) => {
  res.render('task', { title: 'ToDo Liste' });
});

    
//trouver la tache par l'id
router.get('/:id', async function (req, res, next) {

  if (isNaN(req.params.id)) {
  return res.status(400).json({ erreur: "'id' doit être un nombre" });
  }
  const connection = await sql.getConnection();
  const [result] = await connection.query('SELECT * FROM task WHERE id =?', [req.params.id]);
  res.json(result);
});

//poster une tache 
router.post('/', async function (req, res) {
    const { done, datetime, titre, description } = req.body;
  // Vérifications
    if (done === undefined || datetime === undefined || !titre || !description) {
      return res.status(400).json({ erreur: "Champs manquants" });
    }

    if (done !== 0 && done !== 1) {
      return res.status(400).json({ erreur: "'done' doit être 0 ou 1" });
    }

    if (isNaN(Date.parse(datetime))) {
      return res.status(400).json({ erreur: "'datetime' doit être une date valide" });
    }
  const connection = await sql.getConnection();
  const [result] = await connection.query('INSERT INTO task (done, datetime, titre, description) VALUES (?, ?, ?, ?)',[req.body.done , req.body.datetime, req.body.titre, req.body.description]);
  res.json(result)

});


// PUT pour mettre à jour une tâche
router.patch('/:id', async function (req, res) {
  const { done, datetime, titre, description } = req.body;
  if (isNaN(req.params.id)) {
  return res.status(400).json({ erreur: "'id' doit être un nombre" });
  }
  if (done === undefined || datetime === undefined || !titre || !description) {
    return res.status(400).json({ erreur: "Champs manquants" });
  }

  if (done !== 0 && done !== 1) {
    return res.status(400).json({ erreur: "'done' doit être 0 ou 1" });
  }

  if (isNaN(Date.parse(datetime))) {
    return res.status(400).json({ erreur: "'datetime' doit être une date valide" });
  }
  const connection = await sql.getConnection();
  const [result] = await connection.query('UPDATE task SET done = ?,datetime = ?,titre = ?,description = ? WHERE id = ?',[req.body.done , req.body.datetime, req.body.titre, req.body.description , req.params.id]);
  res.json(result)
});

// DELETE pour supprimer une tâche
router.delete('/:id', async function (req, res) {
  if (isNaN(req.params.id)) {
  return res.status(400).json({ erreur: "'id' doit être un nombre" });
  }
  const connection = await sql.getConnection();
  const [result] = await connection.query('DELETE FROM task WHERE id = ?',[req.params.id]);
  res.json(result)
});



module.exports = router;

