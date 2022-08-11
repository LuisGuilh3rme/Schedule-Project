const Login = require('../models/LoginModel');
const User = require('../models/UserModel');

exports.index = (req,res) => {
    return req.session.user ? res.render('logado') : res.render('login');
}

exports.register = async (req, res) => {
    try {
    const login = new Login(req.body);
    
    await login.register();

    if (login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(() => res.redirect('back')); 
        return;
    };
        req.flash('success','Usuário Salvo');
        req.session.save(() => res.redirect('back'));
        return;
    }   catch (error) {
        console.log(error);
        res.render('404');
    }
}

exports.login = async (req, res) => {
    try {
    const login = new Login(req.body);
    
    await login.login();
    
    if (login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(() => res.redirect('back')); 
        return;
    };
        req.flash('success','Entrou com sucesso');
        req.session.user = login.user;
        const save = await User.find(req.session.user._id);
        if (save) req.session.saveUser = save;
        req.session.save(() => res.redirect('/'));
        return;
    }   catch (error) {
        console.log(error);
        res.render('404');
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}