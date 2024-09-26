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

// Atualiza um produto pelo codProd
exports.updateProduct = async (req, res) => {
    const { codProd } = req.params;
    const updatedData = req.body;

    try {
        const product = await Product.findOneAndUpdate({ codProd }, updatedData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado!' });
        }
        res.status(200).json({ message: 'Produto atualizado com sucesso!', product });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o produto', error });
    }
};

// Remove um produto pelo codProd
exports.deleteProduct = async (req, res) => {
    const { codProd } = req.params;

    try {
        const product = await Product.findOneAndDelete({ codProd });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado!' });
        }
        res.status(200).json({ message: 'Produto removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover o produto', error });
    }
};