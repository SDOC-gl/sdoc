// Libs 

import data from './dataModule.js';



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
            
            data.sendWebhook(
                "SITE", 
                `O player: \`${user}\`\n**Entrou no site**.`,
                'warning'
            );
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

                    if (/^https?:\/\//.test(content)) { // Verifica se é um link //

                        data.sendWebhook(
                            "SITE - LOG-BUSCA", 
                            `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                            'success',
                        );
                        
                        window.open(content, '_blank');
                        
                        return;
                    }

                    if (/\.(pdf|jpeg|jpg|png|webm|webp)$/i.test(content)) { // Verifica se é uma foto/video //

                        data.sendWebhook(
                            "SITE - LOG-BUSCA",
                            `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                            'success',
                        );

                        window.open('../resources/' + content, '_blank');

                        return;
                    }

                    if (content === "EXIT()") { // Faz o logout //

                        let username = data.getCookie('user');

                        data.removeCookie('user');

                        // João queiroz


                        data.removeCookie('last_webhook_time');


                        if (!data.getCookie('user') || !data.getCookie('last_webhook_time')) {

                            data.sendWebhook(
                                "SITE - SAIU",
                                `O player: \`${username}\`\n\n**Saiu do site usando EXIT() !**`,
                                'warning'
                            )

                            window.location.href = '../index.html';
                        } else {
                            console.log("Houve um erro");
                        }
                        return;
                    }

                    document.getElementById('displayText').innerHTML = content;

                    data.sendWebhook(
                        "SITE - LOG-BUSCA", 
                        `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``,
                        'success',
                    );
                    
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
