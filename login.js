// Libs
import data from './modules/dataModule.js';

// Verificar se o cookie do usuário está definido
document.addEventListener('DOMContentLoaded', function () {
    const user = data.getCookie('user');
    
    if (user)
       window.location.href = '../QUARTO/';
});

// Manipular o envio do formulário
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nick = document.getElementById('nick').value;

    if (nick.length > 0) {
        document.cookie = `user=${(nick)}; seed=${(31290)} ;max-age=${86400 * 30}; path=/`;
        document.cookie = "deathseed=" + (2025 + Math.floor(Math.random() * 75)) + "; path=/";
        window.location.href = '../QUARTO/';
    }
});