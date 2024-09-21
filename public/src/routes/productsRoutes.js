const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Rota para listar todos os produtos
router.get('/', productsController.getProducts);

// Rota para adicionar um novo produto
router.post('/', productsController.addProduct);

// Rota para atualizar um produto existente
router.put('/:id', productsController.updateProduct);

// Rota para remover um produto
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
