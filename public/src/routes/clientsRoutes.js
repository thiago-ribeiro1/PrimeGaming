const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

// Rota para listar todos os clientes
router.get('/', clientsController.getClients);

// Rota para adicionar um novo cliente
router.post('/', clientsController.addClient);

// Rota para atualizar um cliente existente
router.put('/:id', clientsController.updateClient);

// Rota para remover um cliente
router.delete('/:id', clientsController.deleteClient);

module.exports = router;
