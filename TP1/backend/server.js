const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Client = require('./models/Client');

const app = express(); // D'ABORD on crée app

app.use(cors());       // ENSUITE on utilise cors()
app.use(express.json()); // body-parser intégré

// Connexion MongoDB
mongoose.connect('mongodb://admin:1234@localhost:27017/Clientdb?authSource=admin')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Routes
// Ajouter un client
app.post('/clients', async (req, res) => {
    try {
      const { id, nom, age } = req.body;
      const nouveauClient = new Client({ id, nom, age });
      await nouveauClient.save();
      res.status(201).json(nouveauClient);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Obtenir tous les clients
  app.get('/clients', async (req, res) => {
    try {
      const clients = await Client.find();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Obtenir un client par ID
  app.get('/clients/:id', async (req, res) => {
    try {
      const client = await Client.findOne({ id: req.params.id });
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Supprimer un client
  app.delete('/clients/:id', async (req, res) => {
    try {
      const result = await Client.deleteOne({ id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      res.json({ message: 'Client supprimé' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Modifier un client
  app.put('/clients/:id', async (req, res) => {
    try {
      const { nom, age } = req.body;
      const client = await Client.findOneAndUpdate(
        { id: req.params.id },
        { nom, age },
        { new: true }
      );
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      res.json(client);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

// Démarrage serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
