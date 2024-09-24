const Client = require('../models/ClientesModel');

// Função para listar todos os clientes
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar clientes' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};

// Função para adicionar um novo cliente
exports.addClient = async (req, res) => {
    const { id, name, cpf, age, createdAt } = req.body;

    try {
        const existingClient = await Client.findOne({ id });
        if (existingClient) {
            return res.json({ message: 'ID já está cadastrado com outro cliente' });
        }

        const newClient = new Client({ id, name, cpf, age, createdAt });
        await newClient.save();

        res.json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro | CPF já está registrado na base de dados!' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};

// Função para atualizar um cliente existente
exports.updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, cpf, age } = req.body;

    try {
        const updatedClient = await Client.findOneAndUpdate({ id }, { name, cpf, age }, { new: true });

        if (!updatedClient) {
            return res.status(404).json({ message: 'Cliente não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
        }

        res.json({ message: 'Cliente atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar cliente' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};

// Função para remover um cliente
exports.deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClient = await Client.findOneAndDelete({ id });

        if (!deletedClient) {
            return res.status(404).json({ message: 'Cliente não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
        }

        res.json({ message: 'Cliente removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover cliente' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};
