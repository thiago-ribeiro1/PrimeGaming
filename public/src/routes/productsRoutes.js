const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Rota para listar todos os produtos
router.get('/', productsController.getProducts);

// Rota para obter um produto específico pelo código
router.get('/:codProd', productsController.getProductById);

// Rota para adicionar um novo produto
router.post('/', productsController.addProduct);

// Rota para atualizar um produto existente 
router.put('/:codProd', productsController.updateProduct);

// Rota para remover um produto 
router.delete('/:codProd', productsController.deleteProduct);

// Rota para aplicar desconto a um produto
router.post('/apply-discount', productsController.applyDiscount); // Chamada direta ao controller

module.exports = router;
