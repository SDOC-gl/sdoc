// Libs 

import funcoes from './libs/funcoes.js';

// Verificar cookie do usuário ao carregar a página
/*  -- Desativado temporariamente

document.addEventListener('DOMContentLoaded', function () {
    const user = getCookie('user');
    const displayText = document.getElementById('displayText');

    if (user) {
        displayText.textContent = `Bem vindo(a) ${user}!`;

        const cooldown = 240; // segundos
        const lastWebhookTime = getCookie('last_webhook_time');

        if (!lastWebhookTime || (Date.now() / 1000) - lastWebhookTime > cooldown) {
            document.cookie = `last_webhook_time=${Math.floor(Date.now() / 1000)}; max-age=${86400 * 30}`;
            sendWebhook("SITE", `O player: \`${user}\`\n**Entrou no site**.`);
        }
    } else {
        window.location.href = 'index.html';
    }
});

*/


// Temporario - Verify

document.addEventListener('DOMContentLoaded', function () {
    const user = funcoes.getCookie('user');
    const displayText = document.getElementById('displayText');

    if (user === "g4uradmins") {
        displayText.textContent = `Welcome ${user}!`;

        const cooldown = 240; // segundos
        const lastWebhookTime = getCookie('last_webhook_time');

        if (!lastWebhookTime || (Date.now() / 1000) - lastWebhookTime > cooldown) {
            document.cookie = `last_webhook_time=${Math.floor(Date.now() / 1000)}; max-age=${86400 * 30}`;
            funcoes.sendWebhook("SITE", `O player: \`${user}\`\n**Entrou no site**.`);
        }
    } else {
        funcoes.removeCookie('user');
        funcoes.removeCookie('last_webhook_time');
        window.location.href = '../noauth/';
    }
});


// Manipular o envio do formulário
document.getElementById('consoleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputElement = document.getElementById('pcinput');
    funcoes.process(inputElement.value);
    inputElement.value = '';
});
