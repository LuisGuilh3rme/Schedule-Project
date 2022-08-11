import validator from 'validator';

export default class Contato {
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
        const nameInput = el.querySelector('input[name="name"]');
        const emailInput = el.querySelector('input[name="email"]');
        const phoneInput = el.querySelector('input[name="phone"]');
        const tagName = document.querySelector('.create-name');
        const tagEmail = document.querySelector('.create-email');
        const tagPhone = document.querySelector('.create-phone');
        tagName.innerHTML = "";
        tagEmail.innerHTML = "";
        tagPhone.innerHTML = "";
        
        if (nameInput.value.length < 1) {
            tagName.innerHTML = "Nome obrigatório";
            error = true;
        }

        if ((emailInput.value) && !validator.isEmail(emailInput.value)) {
            tagEmail.innerHTML = "E-mail inválido";
            error = true;
        }

        if (!emailInput.value && !phoneInput.value) {
            tagEmail.innerHTML = "Insira o E-mail ou número de telefone";
            tagPhone.innerHTML = "Insira o E-mail ou número de telefone";
            error = true;
        }
        
        if (!error) el.submit();
    }
}