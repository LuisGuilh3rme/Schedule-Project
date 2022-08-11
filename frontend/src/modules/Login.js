import validator from 'validator';
let stop = 0;
export default class Login {
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
        const emailInput = el.querySelector('input[id="emailLogin"]');
        const passwordInput = el.querySelector('input[id="passwordLogin"]');
        const tagEmail = document.querySelector('.login-email');
        const tagPassword = document.querySelector('.login-password');
        tagEmail.innerHTML = "";
        tagPassword.innerHTML = "";

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