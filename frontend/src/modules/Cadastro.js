import validator from 'validator';

export default class Cadastro {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit',e => {
            e.preventDefault();
            this.validate(e);
        })
    }

    validate(e) {
        let error = false;
        const el = e.target;
        const usernameInput = el.querySelector('input[name="username"]');
        const emailInput = el.querySelector('#emailCad');
        const passwordInput = el.querySelector('#passwordCad');
        const tagUsername = document.querySelector('.create-username');
        const tagEmail = document.querySelector('.create-email');
        const tagPassword = document.querySelector('.create-password');
        tagUsername.innerHTML = "";
        tagEmail.innerHTML = "";
        tagPassword.innerHTML = "";
        
        if (usernameInput.value.length < 4 || usernameInput.value.length > 15) {
            tagUsername.innerHTML = "O nome de usuário deve possuir entre 4 e 15 caracteres";
            error = true;
        }

        if (!validator.isEmail(emailInput.value)) {
            tagEmail.innerHTML = "E-mail inválido";
            error = true;
        }

        if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            tagPassword.innerHTML = "A senha deve possuir entre 3 e 50 caracteres";
            error = true;
        }
        
        if (!error) el.submit();
    }
}