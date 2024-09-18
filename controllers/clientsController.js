const fs = require('fs');
const path = require('path');

// Caminho para os arquivos JSON tirar depois
const clientsFilePath = path.join(__dirname, '../clientes.json'); // Caminho para clientes

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

// Função para listar todos os clientes
exports.getClients = (req, res) => {
    const clients = readClients();
    res.json(clients);
};

// Função para adicionar um novo cliente
exports.addClient = (req, res) => {
    const clients = readClients();
    const newClient = req.body;

    const existingClient = clients.find(client => client.id === newClient.id);
    if (existingClient) {
        return res.json({ message: 'ID já está cadastrado com outro cliente' });
    }

    clients.push(newClient);
    writeClients(clients);

    res.json({ message: 'Cliente cadastrado com sucesso!' });
};

// Função para atualizar um cliente existente
exports.updateClient = (req, res) => {
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
};

// Função para remover um cliente
exports.deleteClient = (req, res) => {
    const clients = readClients();
    const clientId = req.params.id;

    const updatedClients = clients.filter(client => client.id !== clientId);

    if (clients.length === updatedClients.length) {
        return res.status(404).json({ message: 'Cliente não encontrado' }); // 404 Not Found | O servidor não pode encontrar o recurso solicitado
    }

    writeClients(updatedClients);

    res.json({ message: 'Cliente removido com sucesso!' });
};
