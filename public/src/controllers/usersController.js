const User = require('../models/UserModel'); // Ajuste o caminho conforme necessário

// Função para listar todos os usuários
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Busca todos os usuários
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
};

// Função para adicionar um novo usuário
exports.addUser = async (req, res) => {
    const { userId, name, cpf } = req.body;

    try {
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ message: 'ID já está cadastrado com outro usuário' });
        }

        const newUser = new User({ userId, name, cpf });
        await newUser.save(); // Salva o novo usuário no MongoDB
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
};

// Função para atualizar um usuário existente
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ userId }, updatedData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};

// Função para remover um usuário
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findOneAndDelete({ userId });
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário removido com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover usuário' });
    }
};
