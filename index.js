var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Définir une route GET sur /test/*
app.get('/test/*', function(req, res) {
    const param = req.url.substr(6);
    res.json({ msg: param });
});

var compteur = 0;

var allMsgs = [
    { pseudo: "User1", msg: "Hello World", date: new Date() },
    { pseudo: "User2", msg: "foobar", date: new Date() },
    { pseudo: "User3", msg: "CentraleSupelec Forever", date: new Date() }
];

// Récupérer la valeur du compteur
app.get('/cpt/query', function(req, res) {
    res.json({ valeur: compteur });
});

// Incrémenter le compteur
app.get('/cpt/inc', function(req, res) {
    let increment = 1;
    if (req.query.v !== undefined) {
        if (req.query.v.match(/^\d+$/)) {
            increment = parseInt(req.query.v, 10);
        } else {
            return res.json({ code: -1 });
        }
    }
    compteur += increment;
    res.json({ code: 0 });
});

// Ajouter un message via une requête POST
app.post('/msg/post', express.json(), function(req, res) {
  const { pseudo, msg, date } = req.body;

  if (!pseudo || !msg) {
    return res.status(400).json({ error: "Pseudo et message sont nécessaires" });
  }

  // Ajoute le message à la liste
  allMsgs.push({ pseudo, msg, date });

  // Réponse avec un code de succès
  res.status(200).json({ code: 1 });
});


// Récupérer un message par son numéro
app.get('/msg/get/*', function(req, res) {
    const index = parseInt(req.url.substr(9), 10);

    if (isNaN(index) || index < 0 || index >= allMsgs.length) {
        return res.json({ code: 0 });
    }

    res.json({ code: 1, msg: allMsgs[index] });
});

// Récupérer tous les messages
app.get('/msg/getAll', function(req, res) {
    res.json(allMsgs);
});

// Renvoyer le nombre de messages
app.get('/msg/nber', function(req, res) {
    res.json(allMsgs.length);
});

// Supprimer un message
app.get('/msg/del/:index', function(req, res) {
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0 || index >= allMsgs.length) {
        return res.status(400).json({ error: "Index de message invalide" });
    }
    allMsgs.splice(index, 1);
    res.status(200).json({ code: 1 });
});

// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})



app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

