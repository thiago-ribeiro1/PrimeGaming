const mongoose = require('mongoose');

// Definir o schema do usuário
const loginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now }
});

// Criar e exportar o modelo
const login = mongoose.model('Login', loginSchema, 'login');

module.exports = login;
