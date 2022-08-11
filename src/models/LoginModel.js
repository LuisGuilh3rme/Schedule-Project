const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const slurs = process.env.SLURS.split(",");
const LoginSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.validate();
        if (!this.body.username) this.errors.push("Insira o nome de usuário");
        if (this.errors.length > 0) return;
        await this.userExists();
        if (this.errors.length > 0) return;
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }

    static async editUser (user, err) {
        const verify =  await LoginModel.findOne({_id: user._id});
        const users = await LoginModel.findOne({username: user.username});
        const samePerson = await LoginModel.findOne({_id:user._id, username: user.username});
        if (verify && (users) && (!samePerson)) {
            err.push(" Nome de usuário já existente");
            return;
        }
        if (verify) await LoginModel.findByIdAndUpdate(user._id, {username: user.username}, {new: true});
    }

    async login() {
        this.validate();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({email: this.body.email});
        if (!this.user) {
            this.errors.push("Usuário não existente");
            return;
        }
        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push("Senha inválida");
            this.user = null;
            return;
        };

    }
    
    async userExists() {
        this.user = await LoginModel.findOne({username: this.body.username});
        if (this.user) this.errors.push("Nome de usuário já existente");
        this.user = await LoginModel.findOne({email: this.body.email});
        if (this.user) this.errors.push("Usuário já existente");
    }
    
    validate() {
        this.cleanUp();
        if (this.body.username && this.verifySlur(this.body.username)) this.errors.push("Nome inapropriado, tente novamente");
        if (this.body.username && (this.body.username.length < 4 || this.body.username.length > 15)) this.errors.push("O nome de usuário deve possuir entre 4 e 15 caracteres");
        if (!validator.isEmail(this.body.email)) this.errors.push("Email Inválido");
        if (!this.body.password) this.errors.push("Por favor, insira uma senha");
        if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push("A senha deve possuir entre 3 e 50 caracteres");
    }
    
    verifySlur (username) {
        for (let slur of slurs) if (username.toLowerCase().trim().includes(slur)) return true;
        return false;
    }

    cleanUp() {
        for (const key in this.body){
            if (typeof this.body[key] !== 'string') this.body[key];
        }

        this.body = {
            username: this.body.username,
            email: this.body.email,
            password: this.body.password
        }
    }

    static async delete(user) {
        return await LoginModel.findByIdAndDelete(user._id);
    }
}
module.exports = Login;