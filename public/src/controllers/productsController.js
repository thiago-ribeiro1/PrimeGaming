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

// Aplicar Desconto 
exports.applyDiscount = async (req, res) => {
    const { discountCode, productId } = req.body; // Recebendo o código do desconto e o ID do produto

    try {   
        const product = await Product.findById(productId); // Buscar o produto pelo ID
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado!' });
        }

        // Lógica para aplicar um desconto EXEMPLO Máscara
        if (discountCode === 'DESCONTO10') { // Código de desconto de exemplo
            product.price_current *= 0.90; // Aplicar um desconto de 10%
            await product.save(); // Salvar as alterações
            return res.json({ message: 'Desconto aplicado com sucesso!', product });
        } else {
            return res.status(400).json({ message: 'Código de desconto inválido!' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Erro ao aplicar desconto', error });
    }
};

// Obter um produto específico pelo codProd
exports.getProductById = async (req, res) => {
    const { codProd } = req.params;

    try {
        const product = await Product.findOne({ codProd });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado!' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produto' }); // 500 Internal Server Error
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

