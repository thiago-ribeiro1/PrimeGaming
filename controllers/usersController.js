const fs = require('fs');
const path = require('path');

// Caminho para os arquivos JSON tirar depois
const usersFilePath = path.join(__dirname, '../usuarios.json'); // Caminho para usuários

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

// Função para listar todos os usuários
exports.getUsers = (req, res) => {
    const users = readUsers();
    res.json(users);
};

// Função para adicionar um novo usuário
exports.addUser = (req, res) => {
    const users = readUsers();
    const newUser = req.body;

    const existingUser = users.find(user => user.id === newUser.id);
    if (existingUser) {
        return res.json({ message: 'ID já está cadastrado com outro usuário' });
    }

    users.push(newUser);
    writeUsers(users);

    res.json({ message: 'Usuário cadastrado com sucesso!' });
};

// Função para atualizar um usuário existente
exports.updateUser = (req, res) => {
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
};

// Função para remover um usuário
exports.deleteUser = (req, res) => {
    const users = readUsers();
    const userId = req.params.id;

    const updatedUsers = users.filter(user => user.id !== userId);

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ message: 'Usuário não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
    }

    writeUsers(updatedUsers);

    res.json({ message: 'Usuário removido com sucesso!' });
};
