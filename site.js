// Libs 

import data from './dataModule.js';
import webhook from './libs/webhook/webhook.js'

const Hook = new webhook.Webhook("https://discord.com/api/webhooks/1273020022800781494/Y8Ib_CCKtaui7yNP6DZysUSlbx1xxZySc6g5FlhwiOUIOTJmzTjbiV8VICC75911gaS_")

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
            data.sendWebhook("SITE", `O player: \`${user}\`\n**Entrou no site**.`);
        }
    } else {
        window.location.href = 'index.html';
    }
});

*/


// Temporario - Verify

document.addEventListener('DOMContentLoaded', function () {
    const user = data.getCookie('user');
    const displayText = document.getElementById('displayText');

    if (user === "g4uradmins") {
        displayText.textContent = `Welcome ${user}!`;

        const cooldown = 240; // segundos
        const lastWebhookTime = data.getCookie('last_webhook_time');

        if (!lastWebhookTime || (Date.now() / 1000) - lastWebhookTime > cooldown) {
            document.cookie = `last_webhook_time=${Math.floor(Date.now() / 1000)}; max-age=${86400 * 30}`;
            data.sendWebhook("SITE", `O player: \`${user}\`\n**Entrou no site**.`);
        }
    } else {
        data.removeCookie('user');
        data.removeCookie('last_webhook_time');
        window.location.href = '../noauth/';
    }
});

function process(display) {
    const user = data.getCookie('user');
    const jsonUrl = 'https://raw.githubusercontent.com/Atliylol/atliylol.github.io/main/resources/inputs.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(processings => {
            let input_value = (String)(display.toUpperCase());

            for (const processing of processings) {
                if (processing.input.map(item => item.toUpperCase()).includes(input_value)) {
                    const isRandom = (Boolean)(processing.random);
                    let content = processing.result;
                    if (typeof content == "object" && isRandom) {
                        content = content[Math.round(Math.random())];
                    }

                    content.trim();
                    input_value.trim()

                    if (/^https?:\/\//.test(content)) {
                        data.sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                        window.open(content, '_blank');
                        return;
                    }

                    if (/\.(pdf|jpeg|jpg|png|webm|webp)$/i.test(content)) {
                        data.sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                        window.open('../resources/' + content, '_blank');
                        return;
                    }

                    if (content === "EXIT()") {
                        let username = data.getCookie('user');
                        removeCookie('user');
                        removeCookie('last_webhook_time');
                        if (!data.getCookie('user') || !data.getCookie('last_webhook_time')) {
                            data.sendWebhook("SITE - SAIU", `O player: \`${username}\`\n\n**Saiu do site usando EXIT() !**`)
                            window.location.href = '../index.html';
                        } else {
                            console.log("Houve um erro");
                        }
                        return;
                    }

                    document.getElementById('displayText').innerHTML = content;
                    data.sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                    return;
                }
            }



            document.getElementById('displayText').textContent = "Tente novamente.";
        })
        .catch(error => console.error('Erro ao processar JSON:', error));
}

// Manipular o envio do formulário
document.getElementById('consoleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputElement = document.getElementById('pcinput');
    process(inputElement.value);
    inputElement.value = '';
});
