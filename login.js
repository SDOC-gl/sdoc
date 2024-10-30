// Libs
import data from './modules/dataModule.js';

// Manipular o envio do formulário
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nick = document.getElementById('nick').value;

    if ([
        "maxx", "4d", "tetra", "tetradimesional",
        "viajante", "viajantetetradimensional", "viajantetetra",
        "anacrônimo", "apocalipse",
        "monolito", "monolitos", "monólito", "monólitos",
        "espírito", "espirito"
    ].includes(nick.toLowerCase())) {
        window.location.href = '../4D/';
        return;
    }

    if (nick.length > 0) {
        document.cookie = `user=${(nick)}; seed=${(31290)} ;max-age=${86400 * 30}; path=/`;
        document.cookie = "deathseed=" + (2025 + Math.floor(Math.random() * 75)) + "; path=/";
        document.cookie = "candlelight=false; path=/";
        document.cookie = "knife=false; path=/";
        document.cookie = "tetration1=false; path=/";
        window.location.href = '../QUARTO/';
    }
});