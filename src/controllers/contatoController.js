const Contato = require("../models/ContatoModel");

exports.index = (req, res) => {
    res.render("cadastroContato", {
        contato: {}
    })
};

exports.register = async (req, res) => {
    try {
    const contato = new Contato (req.body, req.session.user);
        await contato.register();

        if (contato.errors.length > 0) {
            req.flash("errors", contato.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash("success", "Contato Criado");
        req.session.save(() => res.redirect(`/contato${contato.contato._id}`));
    } catch (error) {
        console.log(error);
        res.render('404');
    }
};

exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render('404');
    const contato = await Contato.findId(req.params.id);
    if (!contato) return res.render('404');
    res.render('cadastroContato', {contato});
}

exports.edit = async (req, res) => {
    if (!req.params.id) return res.render('404');
    try {
        const contato = new Contato(req.body, req.session.user);
        await contato.edit(req.params.id);

        if (contato.errors.length > 0) {
            req.flash("errors", contato.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash("success", "Contato foi editado com sucesso");
        req.session.save(() => res.redirect(`/contato${contato.contato._id}`));
    } catch (error) {
        console.log(error);
        res.render('404');
    }
}

exports.redefine = async(req,res) => {
    await Contato.delete(req.session.user);
    req.flash("success", "Os Contatos foram redefinidos");
    req.session.save(() => res.redirect('back'));
    return;
}

exports.deleteOne = async (req,res) => {
    if (!req.params.id) return res.render('404');
    const contato = await Contato.deleteOne(req.params.id);
    if (!contato) return res.render('404');
    req.flash("success", "O contato foi apagado");
    req.session.save(() => res.redirect('back'));
}