const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.findContact();
    res.render('index', { contatos });
}
