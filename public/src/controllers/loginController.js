const bcrypt = require('bcryptjs');
const Login = require('../models/LoginModel'); 

// Rota de registro (signup)
exports.signup = async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        // Verifica se o usuário já existe
        const userCheck = await Login.findOne({ username });
        if (userCheck) {
            return res.status(400).json({ message: 'Nome de usuário já existe' }); // 400 Bad Request | A Solicitação feita ao servidor é inválida
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(password, 10);

        // Cria um novo usuário
        const newUser = new Login({
            name,
            email,
            username,
            password: senhaCriptografada 
        });

        // Salva o novo usuário no MongoDB
        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso' }); // 201 Created | A solicitação foi bem-sucedida
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ message: 'Erro ao registrar usuário' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};

// Rota de login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Busca o usuário no MongoDB
        const user = await Login.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Usuário ou senha incorretos' }); // 400 Bad Request | A Solicitação feita ao servidor é inválida
        }

        // Verifica se a senha está correta
        const senhaCorreta = await bcrypt.compare(password, user.password);
        if (!senhaCorreta) {
            return res.status(400).json({ message: 'Usuário ou senha incorretos' }); // 400 Bad Request | A Solicitação feita ao servidor é inválida
        }

        // Se o login for bem-sucedido, retorna os dados do usuário
        res.status(200).json({ message: 'Login bem-sucedido', user }); // 200 OK | A solicitação foi bem-sucedida
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ message: 'Erro ao fazer login' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
};
