const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController.js');
const loginController = require('./src/controllers/loginController.js');
const contatoController = require('./src/controllers/contatoController.js');
const userController = require('./src/controllers/userController.js');

const {loginRequired} = require ('./src/middlewares/middleware.js');

// Rota principal
route.get('/', homeController.index);


// Rotas de cadastro/login
route.get('/login', loginController.index);
route.get('/logout', loginController.logout);
route.post('/login/registro', loginController.register);
route.post('/login/entrar', loginController.login);

// Rotas de contato
route.get('/contato', loginRequired, contatoController.index);
route.get('/contato:id', loginRequired, contatoController.editIndex);
route.get('/contato/delete/:id', loginRequired, contatoController.deleteOne);
route.post('/contato/registro', loginRequired, contatoController.register);
route.post('/contato/:id/editar', loginRequired, contatoController.edit);

// Rota do usuário
route.get('/:id', loginRequired, userController.index);
route.post('/:id/redefinir', loginRequired, contatoController.redefine);
route.post('/:id/excluir', loginRequired, userController.delete, loginController.logout);
route.post('/:id/editar', loginRequired, userController.save);
module.exports = route;