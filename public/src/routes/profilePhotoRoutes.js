const express = require('express');
const router = express.Router();
const loginController = require('./controllers/loginController'); 
const photoProfileController = require('./controllers/photoProfileController');

// Rotas de login e signup
router.post('/signup', loginController.signup);
router.post('/login', loginController.login);

// Rota para atualizar a imagem de perfil
router.post('/api/users/updateProfileImage', photoProfileController.updateProfileImage);

module.exports = router;
