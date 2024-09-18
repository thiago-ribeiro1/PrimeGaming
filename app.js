const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // importando dotenv
const loginController = require('./controllers/loginController');


// Inicializa o aplicativo Express
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conectar ao MongoDB (login e produtos)
mongoose.connect('mongodb://localhost:27017/primegaming', {});

// Console conexão com MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

app.post('/signup', loginController.signup);
app.post('/login', loginController.login);

// Importando as rotas
const clientsRoutes = require('./routes/clientsRoutes');
const productsRoutes = require('./routes/productsRoutes');
const usersRoutes = require('./routes/usersRoutes');


app.use('/api/clients', clientsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Aplicação está sendo executada na porta ${PORT}`);
});
