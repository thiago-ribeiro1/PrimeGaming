const fs = require('fs');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./public/src/models/ProdutosModel'); // Produtos Model
const Login = require('./public/src/models/LoginModel'); // Login Model
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Inicializa o aplicativo Express
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Caminhos para os arquivos JSON tirar depois
const clientsFilePath = path.join(__dirname, 'clientes.json'); // Caminho para clientes
const productsFilePath = path.join(__dirname, 'produtos.json'); // Caminho para produtos
const usersFilePath = path.join(__dirname, 'usuarios.json'); // Caminho para usuários


// Conectar ao MongoDB (login e produtos)
mongoose.connect('mongodb://localhost:27017/primegaming', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Console conexão com MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});


// Rota de registro (signup)
app.post('/signup', async (req, res) => {
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
});

// Rota de login
app.post('/login', async (req, res) => {
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
});


// Função para ler os clientes do arquivo JSON
function readClients() {
    if (!fs.existsSync(clientsFilePath)) {
        return [];
    }
    const clientsData = fs.readFileSync(clientsFilePath);
    return JSON.parse(clientsData);
}

// Função para escrever os clientes no arquivo JSON
function writeClients(clients) {
    fs.writeFileSync(clientsFilePath, JSON.stringify(clients, null, 2));
}

// Função para ler os produtos do arquivo JSON
function readProducts() {
    if (!fs.existsSync(productsFilePath)) {
        return [];
    }
    const productsData = fs.readFileSync(productsFilePath);
    return JSON.parse(productsData);
}

// Função para escrever os produtos no arquivo JSON
function writeProducts(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Função para ler os usuários do arquivo JSON
function readUsers() {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
}

// Função para escrever os usuários no arquivo JSON
function writeUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Endpoints para clientes
app.get('/api/clients', (req, res) => {
    const clients = readClients();
    res.json(clients);
});

app.post('/api/clients', (req, res) => {
    const clients = readClients();
    const newClient = req.body;

    const existingClient = clients.find(client => client.id === newClient.id);
    if (existingClient) {
        return res.json({ message: 'ID já está cadastrado com outro cliente' });
    }

    clients.push(newClient);
    writeClients(clients);

    res.json({ message: 'Cliente cadastrado com sucesso!' });
});

app.put('/api/clients/:id', (req, res) => {
    const clients = readClients();
    const clientId = req.params.id;
    const updatedClient = req.body;

    const clientIndex = clients.findIndex(client => client.id === clientId);

    if (clientIndex === -1) {
        return res.status(404).json({ message: 'Cliente não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
    }

    clients[clientIndex] = { ...clients[clientIndex], ...updatedClient };
    writeClients(clients);

    res.json({ message: 'Cliente atualizado com sucesso!' });
});

app.delete('/api/clients/:id', (req, res) => {
    const clients = readClients();
    const clientId = req.params.id;

    const updatedClients = clients.filter(client => client.id !== clientId);

    if (clients.length === updatedClients.length) {
        return res.status(404).json({ message: 'Cliente não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
    }

    writeClients(updatedClients);

    res.json({ message: 'Cliente removido com sucesso!' });
});


// Endpoints para produtos
// Listar todos os produtos
app.get('/api/products', async (req, res) => {
    try {
        // Usando MongoDB para listar todos os produtos
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao carregar produtos' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
});

// Adiciona um novo produto
app.post('/api/products', async (req, res) => {
    const newProduct = req.body;

    try {
        // Usando MongoDB para adicionar um novo produto
        const product = new Product(newProduct);
        await product.save();
        res.json({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar produto' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
});

// Atualiza um produto existente
app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    try {
        // Usando MongoDB para atualizar um produto existente
        // método padrão do Mongoose findByIdAnd
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Produto não encontrado' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
});

// Remove um produto
app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Usando MongoDB para remover um produto
        // método padrão do Mongoose findByIdAnd
        const result = await Product.findByIdAndDelete(productId);
        if (!result) {
            return res.status(404).json({ message: 'Produto não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
        }
        res.json({ message: 'Produto removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Produto não encontrado' }); // 500 Internal Server Error | Servidor não conseguiu processar a solicitação devido a uma falha inesperada
    }
});


// Endpoints para usuários
app.get('/api/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const users = readUsers();
    const newUser = req.body;

    const existingUser = users.find(user => user.id === newUser.id);
    if (existingUser) {
        return res.json({ message: 'ID já está cadastrado com outro usuário' });
    }

    users.push(newUser);
    writeUsers(users);

    res.json({ message: 'Usuário cadastrado com sucesso!' });
});

app.put('/api/users/:id', (req, res) => {
    const users = readUsers();
    const userId = req.params.id;
    const updatedUser = req.body;

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    writeUsers(users);

    res.json({ message: 'Usuário atualizado com sucesso!' });
});

app.delete('/api/users/:id', (req, res) => {
    const users = readUsers();
    const userId = req.params.id;

    const updatedUsers = users.filter(user => user.id !== userId);

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ message: 'Usuário não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
    }

    writeUsers(updatedUsers);

    res.json({ message: 'Usuário removido com sucesso!' });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
