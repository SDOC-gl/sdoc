
let IP = null;
// Função para enviar o webhook.
function sendWebhook(titulo, descricao) {
    const webhookUrl = "https://discord.com/api/webhooks/1273020022800781494/Y8Ib_CCKtaui7yNP6DZysUSlbx1xxZySc6g5FlhwiOUIOTJmzTjbiV8VICC75911gaS_";

    const data = {
        embeds: [{
            title: titulo,
            description: descricao,
            timestamp: new Date().toISOString(),
        }],
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'JavaScript Discord Webhook'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.text())
        .then(text => console.log(text))
        .catch(error => console.error('Erro:', error));
}

// Processar entrada e buscar no JSON
function process(display) {
    const user = getCookie('user');
    const jsonUrl = 'https://glsmp.sunn.cloud/resources/inputs.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(processings => {
            const input_value = display.trim().toUpperCase();

            for (const processing of processings) {
                if (processing.input.map(item => item.toUpperCase()).includes(input_value)) {
                    const content = processing.result;

                    if (/^https?:\/\//.test(content)) {
                        sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                        window.open(content, '_blank');
                        return;
                    }

                    if (/\.(pdf|jpeg|jpg|png|webm|webp)$/i.test(content)) {
                        sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                        window.open('./resources/' + content, '_blank');
                        return;
                    }

                    if (content === "EXIT()") {
                        let username = getCookie('user');
                        removeCookie('user');
                        removeCookie('last_webhook_time');
                        if (!getCookie('user') || !getCookie('last_webhook_time')) {
                            sendWebhook("SITE - SAIU", `O player: \`${username}\`\n\n**Saiu do site usando EXIT() !**`)
                            window.location.href = 'index.html';
                        } else {
                            console.log("Houve um erro");
                        }
                        return;
                    }

                    document.getElementById('displayText').innerHTML = content;
                    sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: \`${content}\``);
                    return;
                }
            }


            let notFoundTxt = "\"" + input_value + "\"" + " não encontrado."
            if (input_value.length >= 10) {
                notFoundTxt = "\"" + (String)(input_value).substring(0, 8) + "..." + "\"" + " não encontrado.";
                sendWebhook("SITE - LOG-BUSCA", `O player: \`${user}\`\n\nBuscou com o parâmetro: \`${display}\`\nResultado: Não encontrado.\n\nDisplay Atual do player: \`${input_value} não encontrado.\``);
            } else {
                notFoundTxt = "Você não adicionou nenhum parâmetro!\nTente novamente!"
            }

            document.getElementById('displayText').textContent = notFoundTxt;
        })
        .catch(error => console.error('Erro ao processar JSON:', error));
}

// Função para obter valor do cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return false;
}

// Função para remover o cookie
function removeCookie(name) {
    const cookie = name
    if (getCookie(cookie)) {
        document.cookie = `${cookie}=; max-age=0; path=/`;
    }
}


fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        IP = data.ip;
    })
    .catch(error => {
        console.log('Error:', error);
});

// Verificar cookie do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    const user = getCookie('user');
    const displayText = document.getElementById('displayText');

    if (user) {
        displayText.textContent = `Welcome ${user}!`;

        const cooldown = 240; // segundos
        const lastWebhookTime = getCookie('last_webhook_time');

        if (!lastWebhookTime || (Date.now() / 1000) - lastWebhookTime > cooldown) {
            document.cookie = `last_webhook_time=${Math.floor(Date.now() / 1000)}; max-age=${86400 * 30}`;
            sendWebhook("SITE", `O player: \`${user}\`\n**Entrou no site**\n\n**Com o ip:** \`${IP}\`.`);
        }
    } else {
        window.location.href = 'index.html';
    }
});


// Manipular o envio do formulário
document.getElementById('consoleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const inputElement = document.getElementById('pcinput');
    process(inputElement.value);
    inputElement.value = '';
});
