const mongoose = require('mongoose');
const slurs = process.env.SLURS.split(",");
const Login = require('./LoginModel');


const UserSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    theme: {type: String, required: true},
    username: {type: String},
});

const UserModel = mongoose.model("Save", UserSchema);

class User {
    constructor(body, session){
        this.body = body;
        this.session = session;
        this.errors = [];
        this.save = null;
    }

    async send() {
        this.validate();
        if (this.errors.length > 0) return;
        await this.saveExists();
        if (this.errors.length > 0) return;
        this.save = await UserModel.findOne({_id: this.body._id});
        if (this.save) {
            await UserModel.findByIdAndUpdate(this.session._id, this.body, {new: true});
            return;
        }
        this.save = await UserModel.create(this.body);
    }

    async saveExists() {
        await Login.editUser(this.body, this.errors);
        if (this.errors.length > 0) return;
        const samePerson = await UserModel.findOne({_id:this.body._id, username: this.body.username});
        const users = await UserModel.findOne({username: this.body.username});
        if ((users) && (!samePerson)) this.errors.push("Nome de usuário já existente");
    }

    validate() {
        this.cleanUp();
        if (this.verifySlur(this.body.username)) this.errors.push("Nome inapropriado, tente novamente");
        if ((this.body.username.length < 4 || this.body.username.length > 15)) this.errors.push(" O nome de usuário deve possuir entre 4 e 15 caracteres");
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
            _id: this.session._id,
            theme: this.body.theme,
            username: this.body.username || this.session.username
        }
    }

    static async delete(user) {
        return await UserModel.findByIdAndDelete(user._id);
    }

    static async find(id) {
        return await UserModel.findById(id);
    }
}

module.exports = User;