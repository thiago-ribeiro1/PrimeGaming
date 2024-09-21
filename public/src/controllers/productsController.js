const Product = require('../models/ProdutosModel');

// Listar todos os produtos
exports.getProducts = async (req, res) => {
    try {
        // Usando MongoDB para listar todos os produtos
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao carregar produtos' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};

// Adiciona um novo produto
exports.addProduct = async (req, res) => {
    const newProduct = req.body;

    try {
        // Usando MongoDB para adicionar um novo produto
        const product = new Product(newProduct);
        await product.save();
        res.json({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar produto' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};

// Atualiza um produto existente
exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
        // Usando MongoDB para atualizar um produto existente
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Produto não encontrado' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};

// Remove um produto
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        // Usando MongoDB para remover um produto
        const result = await Product.findByIdAndDelete(productId);
        if (!result) {
            return res.status(404).json({ message: 'Produto não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
        }
        res.json({ message: 'Produto removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Produto não encontrado' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};
