const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    from: {type: String, required: true},
    name: {type: String, required: true},
    lastName: {type: String, default: ''},
    email: {type: String, default: ''},
    phone: {type: String, default: ''},
    created: {type: Date, default: Date.now}
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

class Contato {
    constructor(body, session) {
        this.body = body,
        this.session = session;
        this.errors = [];
        this.contato = null;
    }

    async register () {
        this.validate();

        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.create(this.body);
    }

    async edit (id) {
        if (typeof id !== "string") return;
        this.validate();
        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true});
    }

    validate() {
        this.cleanUp();
        if (!this.body.name) this.errors.push("É obrigatório enviar o nome");
        if (this.body.email && (!validator.isEmail(this.body.email))) this.errors.push("Email Inválido");
        if (!this.body.email && !this.body.phone) this.errors.push("Informe pelo menos o email ou telefone");
    }
    
    cleanUp() {
        for (const key in this.body){
            if (typeof this.body[key] !== 'string') this.body[key];
        }

        this.body = {
            from: this.session._id,
            name: this.body.name,
            lastName: this.body.lastName,
            email: this.body.email,
            phone: this.body.phone
        }
    }
    
    static async findId (id) {
        if (typeof id !== "string") return;
        return await ContatoModel.findById(id);
    }

    static async findContact () {
        return await ContatoModel.find().sort({created: -1});
    }

    static async delete (user) {
        return await ContatoModel.deleteMany({from: user._id});
    }

    static async deleteOne (id) {
        return await ContatoModel.findOneAndDelete({_id: id});
    }
}
module.exports = Contato;