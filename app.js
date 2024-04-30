// Import des modules requis
const express = require('express');
const mysql = require('mysql');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var app = express();

// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static('public'));


app.engine('hbs', exphbs.engine({ extname: '.hbs', layoutsDir: "views/layouts/" }));
app.set('view engine', 'hbs');


// Use `.hbs` for extensions and find partials in `views/partials`.



// Définition d'une route pour rendre la vue index
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page', layouts: "main" });
});




app.get('/connecte', (req, res) => {
    res.render('connecte', { title: 'Home Page' });
});

app.get('/profile', (req, res) => {
    // Suppose user data is retrieved from the database here
    const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        userType: 'freelance'
    };

    // Render the profile template with user data
    res.render('profile', userData);
});


// Route pour récupérer les données du tableau de bord
app.get('/dashboard', (req, res) => {
    // Render dashboard.hbs
    res.render('dashboard');
});

// Route pour récupérer les données du tableau de bord
app.get('/dashboardFreelance', (req, res) => {
    // Render dashboardFreelance.hbs
    res.render('dashboardFreelance');
});



// Route pour récupérer les données du utilisateurs
app.get('/utilisateurs', (req, res) => {
    // Render utilisateurs.hbs
    res.render('utilisateurs');
});


// Route pour récupérer les données de projects
app.get('/projet', (req, res) => {
    // Render projet.hbs
    res.render('projet');
});
// Route POST pour ajouter un projet
app.post('/Ajouterprojet', (req, res) => {
    const { name, description } = req.body;
    const values = [name, description];
    const sql = 'INSERT INTO projet (name, description) VALUES (?, ?)';
    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du projet à la base de données MySQL:', err);
            return res.status(500).send('Erreur lors de l\'ajout du projet');
        }
        console.log('Projet ajouté avec succès');
        res.status(201).json({ message: 'Projet ajouté avec succès' });
    });
});


// Route pour récupérer les données de facture
app.get('/facture', (req, res) => {
    // Render facture.hbs
    res.render('facture');
});

// Route pour récupérer les données de message
app.get('/message', (req, res) => {
    // Render message.hbs
    res.render('message');
});



// Configuration de la connexion MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'freelance',
});

// Établir la connexion à la base de données
connection.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :" + err.stack);
        return;
    }
    console.log("Connecté à la base de données MySQL.");
});

// Route pour récupérer les données de client
app.get('/Client', (req, res) => {
    // Render client.hbs
    res.render('Client');
});

// Route pour ajouter un client
app.post('/ajouterClient', (req, res) => {
    const { nom, prenom, telephone, email } = req.body;
    const values = [nom, prenom, telephone, email];
    const sql = 'INSERT INTO client (Nom, Prénom, Téléphone, Email)  VALUES (?, ?, ?, ?)';

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du client :', err);
            return res.status(500).send('Erreur lors de l\'ajout du client');
        }
        console.log('Nouveau client ajouté avec succès, ID :', results.insertId);
        res.redirect('/listeClient'); // Redirection vers la liste des clients
    });
});
  // Route pour afficher la liste des clients
app.get('/listeClient', (req, res) => {
    // Exécuter la requête SQL pour récupérer tous les clients
    connection.query('SELECT * FROM client', (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération de la liste des clients : ', error);
            return res.status(500).send('Erreur lors de la récupération de la liste des clients');
        }
  
        // Afficher les données des clients sur votre interface utilisateur en utilisant Handlebars
        res.render('listeClient', { clients: results }); // Passer les résultats de la requête à la vue
    });
});

  

 // Route pour récupérer les calculer les charges sociales
app.get('/calcule', (req, res) => {
    // Render calcule.hbs
    res.render('calcule');
});

  // Route pour calculer les charges sociales
app.post('/calculer-charges', (req, res) => {
    const chiffreAffaires = parseFloat(req.body.chiffreAffaires);
    const typeActivite = req.body.typeActivite;
    const frequencePaiement = req.body.frequencePaiement;

    let pourcentageCharges = 0;
    let charges = 0;

    // Déterminer le pourcentage de charges en fonction du type d'activité
    if (typeActivite === 'achat_revente') {
        pourcentageCharges = 0.128; // 12.8%
    } else if (typeActivite === 'prestation_service') {
        pourcentageCharges = 0.22; // 22%
    } else {
        // Gérer d'autres types d'activités si nécessaire
    }

    // Adapter le pourcentage de charges en fonction de la fréquence de paiement
    if (frequencePaiement === 'mensuel') {
        pourcentageCharges /= 12; // Diviser par 12 pour le paiement mensuel
    } else if (frequencePaiement === 'trimestriel') {
        pourcentageCharges /= 4; // Diviser par 4 pour le paiement trimestriel
    }

    // Calcul des charges sociales
    charges = chiffreAffaires * pourcentageCharges;

    // Renvoyer les charges calculées
    res.json({ charges: charges.toFixed(2) });
});



 // Route pour récupérer le calcul des charges et des revenus
 app.get('/calculer', (req, res) => {
    // Render calculer.hbs
    res.render('calculer');
});


// Route pour le calcul des charges et des revenus
app.post('/calcul', (req, res) => {
    // Récupération des données de la requête
    const revenus = req.body.revenus;
    const charges = req.body.charges;

    // Votre logique de calcul des charges et des revenus
    const taxes = calculerTaxes(revenus);
    const revenuNet = revenus - charges - taxes;

    // Envoi de la réponse
    res.json({ taxes, revenuNet });
});

// Fonction pour calculer les taxes (exemple)
function calculerTaxes(revenus) {
    // Logique de calcul des taxes
    return revenus * 0.3; // Exemple simplifié
}
// Route pour récupérer les données du forum
app.get('/home', (req, res) => {
    // Render home.hbs
    res.render('home');
});
// Route pour la page d'accueil du forum
app.get('/', (req, res) => {
    // Vous pouvez ici récupérer les données nécessaires à partir de la base de données et les passer au modèle
    res.render('home', { title: 'Accueil du forum' });
});

// Route pour afficher une catégorie spécifique et ses posts
app.get('/category/:id', (req, res) => {
    const categoryId = req.params.id;
    // Vous pouvez ici récupérer les données nécessaires à partir de la base de données en fonction de l'ID de la catégorie
    res.render('category', { title: 'Catégorie du forum', categoryId });
});

// Route pour afficher un post spécifique
app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    // Vous pouvez ici récupérer les données nécessaires à partir de la base de données en fonction de l'ID du post
    res.render('post', { title: 'Post du forum', postId });
});






// Route pour récupérer les données du facture
app.get('/index2', (req, res) => {
    // Render index2.hbs
    res.render('index2');
});
// Routes
app.get('/', (req, res) => {
    res.render('index2', { title: 'Accueil - Gestion des Factures' });
});

app.get('/invoices', (req, res) => {
    connection.query('SELECT * FROM invoices', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des factures :', err);
            return res.status(500).send('Erreur serveur');
        }
        res.render('invoices', { title: 'Liste des Factures', invoices: results });
    });
});
app.post('/invoices', (req, res) => {
    const { client_name, amount, due_date } = req.body;
    const query = 'INSERT INTO invoices (client_name, amount, due_date) VALUES (?, ?, ?)';
    connection.query(query, [client_name, amount, due_date], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de la facture :', err);
            return res.status(500).send('Erreur serveur');
        }
        console.log('Facture ajoutée avec succès');
        res.redirect('/invoices');
    });
});


// Route pour récupérer les données de notification
app.get('/notification', (req, res) => {
    // Render notification.hbs
    res.render('notification');
});

// Configuration de nodemailer avec les informations de votre compte de messagerie
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Service de messagerie (par exemple, Gmail)
    auth: {
        user: 'votreadresse@gmail.com', // Adresse e-mail utilisée pour envoyer les notifications
        pass: 'votremotdepasse' // Mot de passe de votre adresse e-mail
    }
});

// Route pour envoyer une notification par e-mail
app.post('/sendEmailNotification', (req, res) => {
    const { destinataire, sujet, message } = req.body;

    // Options pour l'e-mail
    const mailOptions = {
        from: 'votreadresse@gmail.com',
        to: destinataire,
        subject: sujet,
        text: message
    };

    // Envoi de l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
            res.status(500).send('Erreur lors de l\'envoi de l\'e-mail');
        } else {
            console.log('E-mail envoyé avec succès :', info.response);
            res.status(200).send('E-mail envoyé avec succès');
        }
    });
});


// Route pour récupérer les données de bilan
app.get('/bilan', (req, res) => {
    // Render bilan.hbs
    res.render('bilan');
});

// Route pour récupérer les données de bilan
app.get('/AjouterBilan', (req, res) => {
    // Render AjouterBilan.hbs
    res.render('AjouterBilan');
});

// Route POST pour ajouter des données à la base de données
app.post('/AjouterBilan', (req, res) => {
    // Récupération des données envoyées depuis le frontend
    const { year, total_assets, total_liabilities, net_worth } = req.body;
  
    // Logique pour ajouter les données à la base de données
    const query = `INSERT INTO bilan_annuel (year, total_assets, total_liabilities, net_worth) VALUES (?, ?, ?, ?)`;
    // Exemple d'utilisation de la méthode de connexion à la base de données, cela dépend de votre système de gestion de base de données
    // db.query(query, [year, total_assets, total_liabilities, net_worth], (err, result) => {
       // if (err) {
    //         console.error('Erreur lors de l\'ajout du bilan :', err);
    //         res.status(500).json({ message: 'Erreur lors de l\'ajout du bilan' });
    //     } else {
    //         console.log('Bilan ajouté avec succès');
    //         res.json({ message: 'Bilan ajouté avec succès' });
    //     }
    // });

    // Pour cet exemple, je vais simplement simuler l'ajout du bilan
    console.log('Bilan ajouté avec succès:', { year, total_assets, total_liabilities, net_worth });
    res.json({ message: 'Bilan ajouté avec succès' });
});


 // Route pour récupérer le gestionProfil
 app.get('/gestionProfil', (req, res) => {
    // Render gestionProfil.hbs
    res.render('gestionProfil');
});
// Endpoint pour enregistrer le profil
app.post('/Ajouterprofiles', (req, res) => {
    const { nom, bio, address, email, phone, cin } = req.body;
     // Requête SQL d'insertion
    const query = 'INSERT INTO votre_table (nom, bio, address, email, phone, cin) VALUES (?, ?, ?, ?, ?, ?)';
     // Exécution de la requête SQL
    connection.query(query, [nom, bio, address, email, phone, cin], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout des données:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'ajout des données.' });
        }
        console.log('Données ajoutées avec succès');
        res.status(200).json({ message: 'Données ajoutées avec succès à la base de données.' });
    });
});

 // Route pour récupérer le forum 
 app.get('/forum', (req, res) => {
    // Render forum.hbs
    res.render('forum');
});

// Démarrage du serveur
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




