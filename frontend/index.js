import './src/assets/css/style.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './src/modules/Login';
import Cadastro from './src/modules/Cadastro';
import Contato from './src/modules/Contato';


const login = new Login('.form-login');
const cadastro = new Cadastro('.form-cadastro');
const contato = new Contato('.form-contato');
const contatoEdit = new Contato('.form-contatoEdit');
login.init();
cadastro.init();
contato.init();
contatoEdit.init();
