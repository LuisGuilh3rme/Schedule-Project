const User = require('../models/UserModel');
const Login = require('../models/LoginModel');
const Contato = require('../models/ContatoModel');


exports.index = (req, res) => {
    res.render('user');
}

exports.save = async (req, res) => {
    try {
        const user = new User(req.body, req.session.user);
        
        await user.send();
    
        if (user.errors.length > 0) {
            req.flash('errors', user.errors);
            req.session.save(() => res.redirect('back')); 
            return;
        };
            req.flash('success','Alterações foram feitas');
            req.session.saveUser = user.body;
            req.session.user.username = user.body.username;
            req.session.save(() => res.redirect('back'));
            return;
        }   catch (error) {
            console.log(error);
            res.render('404');
        }
}

exports.delete = async (req, res, next) => {
    await User.delete(req.session.user);
    await Login.delete(req.session.user);
    await Contato.delete(req.session.user);
    next();
}