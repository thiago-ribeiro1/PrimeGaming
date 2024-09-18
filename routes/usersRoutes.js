const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rota para listar todos os usuários
router.get('/', usersController.getUsers);

// Rota para adicionar um novo usuário
router.post('/', usersController.addUser);

// Rota para atualizar um usuário existente
router.put('/:id', usersController.updateUser);

// Rota para remover um usuário
router.delete('/:id', usersController.deleteUser);

module.exports = router;
